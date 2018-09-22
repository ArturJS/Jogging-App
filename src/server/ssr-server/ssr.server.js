import React from 'react';
import { renderToString } from 'react-router-server';
import { StaticRouter } from 'react-router';
import { matchRoutes } from 'react-router-config';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
import _ from 'lodash';
import config from '../../config';
import Html from '../../client/common/helpers/Html';
import { createApolloClient } from '../../client/common/graphql/apollo-client';
import { createRootComponent } from '../../client';
import routes from '../../routes';

export const initSSRServer = app => {
  app.use(async (req, res) => {
    const branch = matchRoutes(routes, req.url);
    const matchedRoute = branch[0];
    const { redirectTo } = matchedRoute.route;

    if (redirectTo) {
      const redirectLocation = `${config.uiTargetUrl}${redirectTo}`;

      _redirectTo(res, redirectLocation);
      return false;
    }

    const pageComponent = getPageComponentFromMatchedRoutes(branch);

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }

    res.send(
      await renderPage(req.url, pageComponent, {
        isLoggedIn: req.isAuthenticated(),
        cookie: req.header('Cookie')
      })
    );
  });
};

export async function renderPage(url, pageComponent, { isLoggedIn, cookie }) {
  const apolloClient = createApolloClient({
    isLoggedIn,
    cookie
  });

  try {
    const Client = createRootComponent({
      apolloClient,
      pageComponent
    });

    await getDataFromTree(
      <ApolloProvider client={apolloClient}>{pageComponent}</ApolloProvider>
    );

    const { html } = await renderToString(
      <Html
        assets={webpackIsomorphicTools.assets()}
        initialApolloState={apolloClient.extract()}
        component={
          __DISABLE_SSR__ ? null : (
            <StaticRouter context={{}} location={url}>
              <Client />
            </StaticRouter>
          )
        }
      />
    );

    return `<!doctype html>${html}`;
  } catch (err) {
    console.error(err);
  }
}

export function getPageComponentFromMatchedRoutes(branch) {
  return _.reduceRight(
    branch,
    (componentPyramid, { route }) =>
      React.createElement(route.pageComponent, {
        children: componentPyramid
      }),
    null
  ); // collect components from the inside out of matched routes;
}

// private methods

function _redirectTo(res, redirectUrl) {
  res.writeHead(302, {
    Location: redirectUrl
  });
  res.end();
}
