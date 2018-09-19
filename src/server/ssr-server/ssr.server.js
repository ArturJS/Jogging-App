import React from 'react';
import { renderToString } from 'react-router-server';
import { StaticRouter } from 'react-router';
import { matchRoutes } from 'react-router-config';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
import { Provider } from 'mobx-react';
import _ from 'lodash';
import Html from '../../client/common/helpers/Html';
import { createApolloClient, createRootComponent, stores } from '../../client';
import routes from '../../routes';

export const initSSRServer = app => {
  app.use(async (req, res) => {
    const branch = matchRoutes(routes, req.url);
    const lastMatchedRoute = _.last(branch);

    if (__SERVER__ && lastMatchedRoute.redirectTo) {
      _redirectTo(res, lastMatchedRoute.redirectTo);
      return false;
    }

    const initialPageData = await _getInitialPageData(branch);
    const pageComponent = getPageComponentFromMatchedRoutes(
      branch,
      initialPageData
    );

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }

    res.send(
      await renderPage(req.url, pageComponent, {
        initialPageData,
        isLoggedIn: req.isAuthenticated(),
        cookie: req.header('Cookie')
      })
    );
  });
};

export async function renderPage(
  url,
  pageComponent,
  { initialPageData, isLoggedIn, cookie }
) {
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
      <ApolloProvider client={apolloClient}>
        <Provider {...stores}>{pageComponent}</Provider>
      </ApolloProvider>
    );

    const initialApolloState = apolloClient.extract();

    const { html } = await renderToString(
      <Html
        assets={webpackIsomorphicTools.assets()}
        initialAppState={{ initialPageData }}
        initialApolloState={initialApolloState}
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

export function getPageComponentFromMatchedRoutes(branch, initialPageData) {
  return _.reduceRight(
    branch,
    (componentPyramid, { route }) =>
      React.createElement(route.pageComponent, {
        children: componentPyramid,
        initialPageData
      }),
    null
  ); // collect components from the inside out of matched routes;
}

// private methods

async function _getInitialPageData(branch) {
  const { fetchData } = branch[0].route.component;
  let initialPageData;

  if (fetchData) {
    try {
      initialPageData = await fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  return initialPageData;
}

function _redirectTo(res, redirectUrl) {
  res.writeHead(302, {
    Location: redirectUrl
  });
  res.end();
}
