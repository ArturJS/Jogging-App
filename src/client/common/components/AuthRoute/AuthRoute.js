import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../../graphql/queries';

export default class AuthRoute extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired
  };

  render() {
    const { component, path } = this.props;

    return (
      <Query query={IS_LOGGED_IN}>
        {({
          data: {
            authState: { isLoggedIn }
          }
        }) =>
          isLoggedIn ? (
            <Route {...this.props} component={component} />
          ) : (
            <Redirect to={{ pathname: '/sign-up', state: { backUrl: path } }} />
          )
        }
      </Query>
    );
  }
}
