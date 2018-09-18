import React from 'react';
import { Redirect } from 'react-router';
import Loadable from 'react-loadable';
import { report } from 'import-inspector';
import path from 'path';

import RedirectAlreadyLogin from './client/common/components/RedirectAlreadyLogin';
import AuthRoute from './client/common/components/AuthRoute';
import SignUpPage from './client/pages/SignUpPage';
import RecordsPage from './client/pages/RecordsPage';
import ReportsPage from './client/pages/ReportsPage';

// taken from https://github.com/webpack/webpack/issues/2461
if (typeof System === 'undefined' || typeof System.import !== 'function') {
  global.System = {
    import: importPath => {
      return Promise.resolve(require(importPath));
    }
  };
}

// todo get rid of LazyLoadable
const routes = [
  {
    path: '/sign-up',
    exact: true,
    pageComponent: SignUpPage,
    component: () => (
      <RedirectAlreadyLogin to="/sign-up" component={SignUpPage} />
    )
  },
  {
    path: '/records',
    exact: true,
    pageComponent: RecordsPage,
    component: () => (
      <AuthRoute
        path="/records"
        component={Loadable({
          loader: () =>
            report(
              System.import(
                /* webpackChunkName: 'RecordsPage' */ './client/pages/RecordsPage/RecordsPage'
              ),
              {
                serverSideRequirePath: path.resolve(
                  __dirname,
                  './client/pages/RecordsPage/RecordsPage'
                ),
                webpackRequireWeakId: () =>
                  require.resolveWeak('./client/pages/RecordsPage/RecordsPage')
              }
            ),
          loading: <div>Loading...</div>
        })}
      />
    )
  },
  {
    path: '/reports',
    exact: true,
    pageComponent: ReportsPage,
    component: () => (
      <AuthRoute
        path="/reports"
        component={Loadable({
          loader: () =>
            report(
              System.import(
                /* webpackChunkName: 'ReportsPage' */ './client/pages/ReportsPage/ReportsPage'
              ),
              {
                serverSideRequirePath: path.resolve(
                  __dirname,
                  './client/pages/ReportsPage/ReportsPage'
                ),
                webpackRequireWeakId: () =>
                  require.resolveWeak('./client/pages/ReportsPage/ReportsPage')
              }
            ),
          loading: <div>Loading...</div>
        })}
      />
    )
  },
  {
    path: '/*',
    redirectTo: '/sign-up', // explicit flag for ssr processing on server.js
    component: () => <Redirect to="/sign-up" />
  }
];

export default routes;
