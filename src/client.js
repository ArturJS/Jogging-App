/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'mobx-react';
import createBrowserHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore } from 'mobx-react-router';
import 'react-table/react-table.css';
import { ApolloProvider } from 'react-apollo';
import rootRoutes from './routes';
import { createApolloClient } from './client/common/graphql/apollo-client';
import RootShell from './client/common/shells/RootShell';
import { routerStore, loadingStore } from './client/common/stores';
import { modalStore } from './client/common/features/ModalDialog';

export const stores = {
  modalStore,
  routerStore,
  loadingStore
};

export const createRootComponent = ({
  apolloClient = createApolloClient(),
  pageComponent
} = {}) => {
  const renderRoutes = routes => {
    return routes ? (
      <Switch>
        {routes.map((route, i) => {
          let childComponents = renderRoutes(route.routes);

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
  };

  return class Client extends Component {
    render() {
      const { children } = this.props;

      return (
        <ApolloProvider client={apolloClient}>
          <Provider {...stores}>
            <RootShell>
              {pageComponent || children || renderRoutes(rootRoutes)}
            </RootShell>
          </Provider>
        </ApolloProvider>
      );
    }
  };
};

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
