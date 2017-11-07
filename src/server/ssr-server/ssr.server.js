import React from 'react';
import {renderToString} from 'react-router-server';
import {StaticRouter} from 'react-router';
import {inspect} from 'import-inspector';
import {matchRoutes} from 'react-router-config';
import _ from 'lodash';

import Html from '../../client/common/helpers/Html';
import Client from '../../client';
import routes from '../../routes';
import {userStore} from '../../client/common/stores';


export const initSSRServer = (app) => {
  app.use(async(req, res) => {
    const branch = matchRoutes(routes, req.url);
    const lastMatchedRoute = _.last(branch);

    if (__SERVER__ && lastMatchedRoute.redirectTo) {
      _redirectTo(res, lastMatchedRoute.redirectTo);
      return false;
    }

    const stores = _getInitialStoresData(req);

    await userStore.init(stores.userStore);

    const initialPageData = await _getInitialPageData(branch);
    const pageComponent = getPageComponentFromMatchedRoutes(branch, initialPageData);

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }

    res.send(
      await renderPage(req.url, pageComponent, {initialPageData, stores})
    );
  });
};

export async function renderPage(url, pageComponent, {initialPageData, stores}) {
  const context = {};
  let lazyImports = [];

  _resetGlobalChartsRenderQueue();

  // setup a watcher
  let stopInspecting = inspect(metadata => { // necessary for react-loadable components
    lazyImports.push(metadata);
  });

  try {
    let {html} = await renderToString(
      <Html
        assets={webpackIsomorphicTools.assets()}
        initialAppState={{initialPageData, stores}}
        component={
          __DISABLE_SSR__ ? null :
            <StaticRouter context={context} location={url}>
              <Client>
                {pageComponent}
              </Client>
            </StaticRouter>
        }
      />
    );

    stopInspecting(); // necessary for react-loadable components
    html = _addLazyModules(html, url, lazyImports);

    return `<!doctype html>${html}`;
  }
  catch (err) {
    console.error(err);
  }
}

export function getPageComponentFromMatchedRoutes(branch, initialPageData) {
  return _.reduceRight(branch, (componentPyramid, {route}) => (
    React.createElement(route.component, {children: componentPyramid, initialPageData})
  ), null); // collect components from the inside out of matched routes;
}


// private methods

const lazyModulesCache = {};

async function _getInitialPageData(branch) {
  const {fetchData} = branch[0].route.component;
  let initialPageData;

  if (fetchData) {
    try {
      initialPageData = await fetchData();
    }
    catch (err) {
      console.error(err);
    }
  }

  return initialPageData;
}

function _getInitialStoresData(req) {
  let stores = {
    userStore: null
  };

  if (req.isAuthenticated()) {
    const {
      firstName,
      lastName,
      email
    } = req.user.dataValues;

    stores.userStore = {
      firstName,
      lastName,
      email
    };
  }

  return stores;
}

function _resetGlobalChartsRenderQueue() {
  global.chartsRenderQueue = {
    barChartQueue: []
  };
}

function _addLazyModules(html, requestUrl, lazyImports) {
  if (
    lazyImports.length === 0 && !lazyModulesCache[requestUrl] // necessary due to "lazyImports" generates only on first invocation ("renderToString" uses cache internally)
  ) return html;

  if (lazyImports.length > 0) {
    lazyModulesCache[requestUrl] = lazyImports;
  }

  lazyImports = lazyModulesCache[requestUrl];

  const lazyScripts = lazyImports.map(lazyImport => {
    const lazyChunkPath = _getChunkPath(lazyImport.serverSideRequirePath);
    return `<script src="${lazyChunkPath}" charset="UTF-8"><script/>`;
  });

  return html.replace('</body>', lazyScripts + '</body>');
}

function _getChunkPath(serverSideRequirePath) {
  const moduleName = serverSideRequirePath.substr(serverSideRequirePath.lastIndexOf('\\') + 1);
  return webpackIsomorphicTools.assets().javascript[moduleName];
}

function _redirectTo(res, redirectUrl) {
  res.writeHead(302, {
    Location: redirectUrl
  });
  res.end();
}
