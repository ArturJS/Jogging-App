import React from 'react';
import {Redirect} from 'react-router';
import Loadable from 'react-loadable';
import {report} from 'import-inspector';
import path from 'path';

import SignUpPage from './client/pages/SignUpPage';


// taken from https://github.com/webpack/webpack/issues/2461
if (typeof System === 'undefined' || typeof System.import !== 'function') {
  global.System = {
    import: (importPath) => {
      return Promise.resolve(require(importPath));
    }
  };
}

const routes = [
  {
    path: '/sign-up',
    exact: true,
    component: SignUpPage
  },
  {
    path: '/records',
    exact: true,
    component: Loadable({
      loader: () => report(
        System.import(/* webpackChunkName: 'RecordsPage' */'./client/pages/RecordsPage/RecordsPage'),
        {
          serverSideRequirePath: path.resolve(__dirname, './client/pages/RecordsPage/RecordsPage'),
          webpackRequireWeakId: () => require.resolveWeak('./client/pages/RecordsPage/RecordsPage')
        }
      ),
      loading: <div>Loading...</div>
    })
  },
  {
    path: '/reports',
    exact: true,
    component: Loadable({
      loader: () => report(
        System.import(/* webpackChunkName: 'ReportsPage' */'./client/pages/ReportsPage/ReportsPage'),
        {
          serverSideRequirePath: path.resolve(__dirname, './client/pages/ReportsPage/ReportsPage'),
          webpackRequireWeakId: () => require.resolveWeak('./client/pages/ReportsPage/ReportsPage')
        }
      ),
      loading: <div>Loading...</div>
    })
  },
  {
    path: '/*',
    redirectTo: '/sign-up', // explicit flag for ssr processing on server.js
    component: () => <Redirect to="/sign-up"/>
  }
];

export default routes;
