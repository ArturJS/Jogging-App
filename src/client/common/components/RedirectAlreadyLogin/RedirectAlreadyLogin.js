import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../../graphql/queries';

@withRouter
export default class RedirectAlreadyLogin extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  render() {
    const {
      component,
      location: { state }
    } = this.props;

    return (
      <Query query={IS_LOGGED_IN}>
        {({
          data: {
            authState: { isLoggedIn }
          }
        }) =>
          isLoggedIn ? (
            state && state.backUrl ? (
              <Redirect to={state.backUrl} />
            ) : (
              <Redirect to={'/records'} />
            )
          ) : (
            <Route {...this.props} component={component} />
          )
        }
      </Query>
    );
  }
}
