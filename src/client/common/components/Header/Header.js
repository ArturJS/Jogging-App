import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../../graphql/queries';
import { UPDATE_IS_LOGGED_IN } from '../../graphql/mutations';
import {
  FormStore,
  Form,
  Field,
  Controls,
  Validators
} from '../../features/Form';
import { loginApi } from '../../api/loginApi';
import './Header.scss';

@graphql(
  gql`
    mutation SignInMutation($email: String!, $password: String!) {
      signIn(signIn: { email: $email, password: $password }) {
        email
        firstName
        lastName
      }
    }
  `,
  {
    name: 'signInMutation'
  }
)
@graphql(UPDATE_IS_LOGGED_IN, {
  name: 'updateIsLoggedIn'
})
@withRouter
export default class Header extends Component {
  static propTypes = {
    signInMutation: PropTypes.func.isRequired,
    updateIsLoggedIn: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    error: null
  };

  componentWillMount() {
    this.formStore = new FormStore({
      authEmail: {
        value: '',
        validators: [Validators.required(true)]
      },
      authPassword: {
        value: '',
        validators: [Validators.required(true)]
      }
    });
  }

  onSignIn = async () => {
    if (!this.formStore.validate().valid) {
      this.formStore.setFocusFirstInvalid();
      return;
    }

    const { authEmail, authPassword } = this.formStore.values;

    try {
      await this.props.signInMutation({
        variables: {
          email: authEmail,
          password: authPassword
        }
      });

      await this.props.updateIsLoggedIn({
        variables: {
          isLoggedIn: true
        }
      });

      this.formStore.resetFormData();
      this.setState({ error: null });
    } catch (err) {
      this.processAjaxError(err);
    }
  };

  onSignOut = async () => {
    await loginApi.doSignOut(); // todo replace with sithOutMutation
    await this.props.updateIsLoggedIn({
      variables: {
        isLoggedIn: false
      }
    });
    this.props.history.push('/sign-up');
  };

  processAjaxError = err => {
    const { error } = err.response.data;
    this.setState({ error });
  };

  renderLogout() {
    return (
      <button
        type="button"
        className="btn btn-default"
        onClick={this.onSignOut}
      >
        Logout
      </button>
    );
  }

  renderLogin() {
    const { error } = this.state;
    const { inputTextCtrl, inputPasswordCtrl } = Controls;

    return (
      <Form
        className="login-form"
        store={this.formStore}
        onSubmit={this.onSignIn}
      >
        <Field
          className="control-field"
          name="authEmail"
          control={inputTextCtrl}
          placeholder={'Email'}
        />
        <Field
          className="control-field"
          name="authPassword"
          control={inputPasswordCtrl}
          placeholder={'Password'}
        />
        {error && (
          <div className="login-error-summary field-error-text">{error}</div>
        )}
        <button type="submit" className="btn btn-default btn-submit">
          Log In
        </button>
      </Form>
    );
  }

  render() {
    return (
      <Query query={IS_LOGGED_IN}>
        {({
          data: {
            authState: { isLoggedIn }
          }
        }) => (
          <div
            className={classNames('header', {
              'is-logged-in': isLoggedIn
            })}
          >
            <div className="header-brand">Jogging App</div>
            <div className="header-auth">
              {isLoggedIn ? this.renderLogout() : this.renderLogin()}
            </div>
          </div>
        )}
      </Query>
    );
  }
}
