import React from 'react';
import { parse } from 'url';
import NextLink from 'next/link';
import NextRouter from 'next/router';
import _ from 'lodash';
import cx from 'classnames';
import { Route } from './route';

export class Routes {
    constructor({ Link = NextLink, Router = NextRouter } = {}) {
        this.routes = [];
        this.Link = this.getLink(Link);
        this.Router = this.getRouter(Router);
    }

    add({ name, pattern, page, canActivate }) {
        let options;

        if (name instanceof Object) {
            options = name;
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            name = options.name;
        } else {
            if (name[0] === '/') {
                /* eslint-disable no-param-reassign */
                page = pattern;
                pattern = name;
                name = null;
                /* eslint-enable no-param-reassign */
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
            canActivate
        });

        this.routes.push(new Route(options));

        return this;
    }

    findByName(name) {
        if (name) {
            return this.routes.filter(route => route.name === name)[0];
        }

        return null;
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
        const foundRoute = this.findByName(nameOrUrl);

        if (foundRoute) {
            return {
                route: foundRoute,
                urls: foundRoute.getUrls(params),
                byName: true
            };
        }
        const { route, query } = this.match(nameOrUrl);
        const href = route ? route.getHref(query) : nameOrUrl;
        const urls = { href, as: nameOrUrl };

        return {
            route,
            urls
        };
    }

    getRequestHandler(app, customHandler) {
        const nextHandler = app.getRequestHandler();

        return (req, res) => {
            const { route, query, parsedUrl } = this.match(req.url);

            if (route) {
                if (customHandler) {
                    customHandler({ req, res, route, query });
                } else {
                    const canActivate = (route.canActivate || []).every(guard =>
                        guard({ req, res })
                    );

                    if (!canActivate) {
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
                Object.assign(
                    newProps,
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.findAndGetUrls(nameOrUrl, params).urls
                );
            }

            const isActiveRoute =
                route === undefined
                    ? false
                    : // eslint-disable-next-line react/no-this-in-sfc
                      this.findAndGetUrls(route, params).urls.as ===
                      this.Router.asPath; // eslint-disable-line react/no-this-in-sfc

            return (
                // eslint-disable-next-line react/jsx-filename-extension
                <Link {...newProps}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                        className={cx(className, {
                            [activeClassName]: isActiveRoute
                        })}
                    >
                        {children}
                    </a>
                </Link>
            );
        };

        return LinkRoutes;
    }

    getRouter(Router) {
        // only for client side
        const disallowTransition = routePath => {
            const { route } = this.match(routePath);

            if (!route) {
                return false;
            }

            const canActivate = route.canActivate.every(guard => guard());

            return canActivate;
        };
        const wrap = method => (route, params, options) => {
            const {
                byName,
                urls: { as, href }
            } = this.findAndGetUrls(route, params);

            if (disallowTransition(route)) {
                return null;
            }

            return Router[method](href, as, byName ? options : params);
        };

        /* eslint-disable no-param-reassign */
        Router.pushRoute = wrap('push');
        Router.replaceRoute = wrap('replace');
        Router.prefetchRoute = wrap('prefetch');
        /* eslint-enable no-param-reassign */

        return Router;
    }
}
