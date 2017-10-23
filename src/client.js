/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import {Switch, Route} from 'react-router';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'mobx-react';

import rootRoutes from './routes';
import RootShell from './client/common/shells/RootShell';
import {userStore} from './client/common/stores';
import {modalStore} from './client/common/features/ModalDialog';

let dest;

const stores = {
  userStore,
  modalStore
};

const Client = ({children}) => (
  <Provider {...stores}>
    <RootShell>
      {children || _renderRoutes(rootRoutes)}
    </RootShell>
  </Provider>
);

if (__CLIENT__) {
  dest = document.getElementById('content');
  render(
    <BrowserRouter>
      <Client />
    </BrowserRouter>,
    dest
  );
}

export default Client;


if (process.env.NODE_ENV !== 'production') {
  global.React = React; // enable debugger

  if (
    !dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']
  ) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

function _renderRoutes(routes) {
  return (
    routes
      ?
      <Switch>
        {routes.map((route, i) => {
          let childComponents = _renderRoutes(route.routes);

          if (childComponents) {
            childComponents = (
              <route.component>
                {childComponents}
              </route.component>
            );
          }
          return (
            <Route
              key={route.key || i}
              path={route.path}
              exact={route.exact}
              strict={route.strict}
              component={childComponents ? null : route.component}>
              {childComponents}
            </Route>
          );
        })}
      </Switch>
      : null
  );
}