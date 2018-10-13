import pathToRegexp from 'path-to-regexp';
import React from 'react';
import { parse } from 'url';
import NextLink from 'next/link';
import NextRouter from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';

export const performRedirect = ({ req, res, redirectTo }) => {
  res.writeHead(301, {
    Location: `${req.protocol}://${req.headers.host}${redirectTo}`
  });
  res.end();
};

class Routes {
  constructor({ Link = NextLink, Router = NextRouter } = {}) {
    this.routes = [];
    this.Link = this.getLink(Link);
    this.Router = this.getRouter(Router);
  }

  add({ name, pattern, page, onlyForAuthenticated, onlyForUnauthenticated }) {
    let options;

    if (name instanceof Object) {
      options = name;
      name = options.name;
    } else {
      if (name[0] === '/') {
        page = pattern;
        pattern = name;
        name = null;
      }

      options = {
        name,
        pattern,
        page
      };
    }

    if (this.findByName(name)) {
      throw new Error(`Route "${name}" already exists`);
    }

    _.extend(options, {
      onlyForAuthenticated,
      onlyForUnauthenticated
    });

    this.routes.push(new Route(options));

    return this;
  }

  findByName(name) {
    if (name) {
      return this.routes.filter(route => route.name === name)[0];
    }
  }

  match(url) {
    const parsedUrl = parse(url, true);
    const { pathname, query } = parsedUrl;
    const traverseOverRoutes = (result, route) => {
      if (result.route) {
        return result;
      }

      const params = route.match(pathname);

      if (!params) {
        return result;
      }

      return _.extend({}, result, {
        route,
        params,
        query: _.extend({}, query, params)
      });
    };

    return this.routes.reduce(traverseOverRoutes, {
      query,
      parsedUrl
    });
  }

  findAndGetUrls(nameOrUrl, params) {
    const route = this.findByName(nameOrUrl);

    if (route) {
      return {
        route,
        urls: route.getUrls(params),
        byName: true
      };
    } else {
      const { route, query } = this.match(nameOrUrl);
      const href = route ? route.getHref(query) : nameOrUrl;
      const urls = { href, as: nameOrUrl };

      return {
        route,
        urls
      };
    }
  }

  getRequestHandler(app, customHandler) {
    const nextHandler = app.getRequestHandler();

    return (req, res) => {
      const { route, query, parsedUrl } = this.match(req.url);

      if (route) {
        if (customHandler) {
          customHandler({ req, res, route, query });
        } else {
          const isAuthenticated = req.isAuthenticated();

          if (route.onlyForUnauthenticated && isAuthenticated) {
            const { redirectTo } = route.onlyForUnauthenticated;
            performRedirect({ req, res, redirectTo });

            return;
          } else if (route.onlyForAuthenticated && !isAuthenticated) {
            const { redirectTo } = route.onlyForAuthenticated;
            performRedirect({ req, res, redirectTo });

            return;
          }

          app.render(req, res, route.page, query);
        }
      } else {
        nextHandler(req, res, parsedUrl);
      }
    };
  }

  getLink(Link) {
    const LinkRoutes = props => {
      const {
        route,
        params,
        className,
        activeClassName,
        children,
        ...newProps
      } = props;
      const nameOrUrl = route;

      if (nameOrUrl) {
        Object.assign(newProps, this.findAndGetUrls(nameOrUrl, params).urls);
      }

      const isActiveRoute =
        props.route === undefined
          ? false
          : this.findAndGetUrls(props.route, props.params).urls.as ===
            this.Router.asPath;

      return React.createElement(
        Link,
        newProps,
        React.createElement(
          'a',
          {
            className: classNames(className, {
              [activeClassName]: isActiveRoute
            })
          },
          children
        )
      );
    };

    return LinkRoutes;
  }

  getRouter(Router) {
    const disallowTransition = routePath => {
      const { route } = this.match(routePath);
      const { isAuthenticated } = Router;

      return (
        route &&
        ((route.onlyForUnauthenticated && isAuthenticated) ||
          (route.onlyForAuthenticated && !isAuthenticated))
      );
    };
    const wrap = method => (route, params, options) => {
      const {
        byName,
        urls: { as, href }
      } = this.findAndGetUrls(route, params);

      if (disallowTransition(route)) {
        return;
      }

      return Router[method](href, as, byName ? options : params);
    };

    Router.pushRoute = wrap('push');
    Router.replaceRoute = wrap('replace');
    Router.prefetchRoute = wrap('prefetch');

    Router.toggleAuth = isAuthenticated => {
      Router.isAuthenticated = _.isBoolean(isAuthenticated)
        ? isAuthenticated
        : !Router.isAuthenticated;
    };

    return Router;
  }
}

class Route {
  constructor({
    name,
    pattern,
    page = name,
    onlyForUnauthenticated,
    onlyForAuthenticated // todo validate incoming params
  }) {
    if (!name && !page) {
      throw new Error(`Missing page to render for route "${pattern}"`);
    }

    this.name = name;
    this.pattern = pattern || `/${name}`;
    this.page = page.replace(/(^|\/)index$/, '').replace(/^\/?/, '/');
    this.regex = pathToRegexp(this.pattern, (this.keys = []));
    this.keyNames = this.keys.map(key => key.name);
    this.toPath = pathToRegexp.compile(this.pattern);
    this.onlyForUnauthenticated = onlyForUnauthenticated;
    this.onlyForAuthenticated = onlyForAuthenticated;
  }

  match(path) {
    const values = this.regex.exec(path);

    if (values) {
      return this.valuesToParams(values.slice(1));
    }
  }

  valuesToParams(values) {
    return values.reduce((params, val, i) => {
      if (val === undefined) {
        return params;
      }

      return Object.assign(params, {
        [this.keys[i].name]: decodeURIComponent(val)
      });
    }, {});
  }

  getHref(params = {}) {
    return `${this.page}?${toQueryString(params)}`;
  }

  getAs(params = {}) {
    const as = this.toPath(params) || '/';
    const keys = Object.keys(params);
    const qsKeys = keys.filter(key => this.keyNames.indexOf(key) === -1);

    if (!qsKeys.length) {
      return as;
    }

    const qsParams = qsKeys.reduce(
      (qs, key) =>
        Object.assign(qs, {
          [key]: params[key]
        }),
      {}
    );

    return `${as}?${toQueryString(qsParams)}`;
  }

  getUrls(params) {
    const as = this.getAs(params);
    const href = this.getHref(params);

    return {
      as,
      href
    };
  }
}

const toQueryString = obj =>
  Object.keys(obj)
    .filter(key => obj[key] !== null && obj[key] !== undefined)
    .map(key => {
      let value = obj[key];

      if (Array.isArray(value)) {
        value = value.join('/');
      }

      return [encodeURIComponent(key), encodeURIComponent(value)].join('=');
    })
    .join('&');

export default opts => new Routes(opts);
