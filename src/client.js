/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import { Switch, Route } from 'react-router';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'mobx-react';
import createBrowserHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore } from 'mobx-react-router';
import 'react-table/react-table.css';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-fetch';

import rootRoutes from './routes';
import RootShell from './client/common/shells/RootShell';
import { routerStore, loadingStore } from './client/common/stores';
import { modalStore } from './client/common/features/ModalDialog';
import { recordsStore } from './client/pages/RecordsPage';

const stores = {
  modalStore,
  recordsStore,
  routerStore,
  loadingStore
};

export const createApolloClient = ({ isLoggedIn = false } = {}) => {
  const cache = __CLIENT__
    ? new InMemoryCache().restore(window.__APOLLO_STATE__)
    : new InMemoryCache();
  const defaultClientState = __SERVER__
    ? {
        authState: {
          __typename: 'AuthState',
          isLoggedIn
        }
      }
    : null;

  return new ApolloClient({
    // link: createHttpLink({ uri: '/graphql', fetch }),
    cache,
    clientState: {
      defaults: defaultClientState,
      resolvers: {
        Mutation: {
          updateIsLoggedIn: (_, { isLoggedIn }, { cache }) => {
            cache.writeData({
              data: {
                authState: {
                  __typename: 'AuthState',
                  isLoggedIn
                }
              }
            });

            return null;
          }
        }
      }
    }
  });
};

export const createRootComponent = ({
  apolloClient = createApolloClient(),
  pageComponent
} = {}) => ({ children }) => (
  <ApolloProvider client={apolloClient}>
    <Provider {...stores}>
      <RootShell>
        {pageComponent || children || _renderRoutes(rootRoutes)}
      </RootShell>
    </Provider>
  </ApolloProvider>
);

const Client = createRootComponent();

let dest;

if (__CLIENT__) {
  const browserHistory = createBrowserHistory();
  const history = syncHistoryWithStore(browserHistory, routerStore);

  dest = document.getElementById('content');

  render(
    <Router history={history}>
      <Client />
    </Router>,
    dest
  );
}

export default Client;

if (process.env.NODE_ENV !== 'production') {
  global.React = React; // enable debugger

  if (
    !dest ||
    !dest.firstChild ||
    !dest.firstChild.attributes ||
    !dest.firstChild.attributes['data-react-checksum']
  ) {
    console.error(
      'Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.'
    );
  }
}

function _renderRoutes(routes) {
  return routes ? (
    <Switch>
      {routes.map((route, i) => {
        let childComponents = _renderRoutes(route.routes);

        if (childComponents) {
          childComponents = (
            <route.component>{childComponents}</route.component>
          );
        }
        return (
          <Route
            key={route.key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            component={childComponents ? null : route.component}
          >
            {childComponents}
          </Route>
        );
      })}
    </Switch>
  ) : null;
}
