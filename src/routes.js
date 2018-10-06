import React from 'react';
import { Redirect } from 'react-router';
import RedirectAlreadyLogin from './client/common/components/RedirectAlreadyLogin';
import AuthRoute from './client/common/components/AuthRoute';
import SignUpPage from './client/pages/sign-up';
import RecordsPage from './client/pages/records';
import ReportsPage from './client/pages/reports';

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
    component: () => <AuthRoute path="/records" component={RecordsPage} />
  },
  {
    path: '/reports',
    exact: true,
    pageComponent: ReportsPage,
    component: () => <AuthRoute path="/reports" component={ReportsPage} />
  },
  {
    path: '/*',
    redirectTo: '/sign-up', // explicit flag for ssr processing on server.js
    component: () => <Redirect to="/sign-up" />
  }
];

export default routes;
