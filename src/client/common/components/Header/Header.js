import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../../graphql/queries';
import { setIsLoggedIn } from '../../graphql/utils';
import {
  FormStore,
  Form,
  Field,
  Controls,
  Validators
} from '../../features/Form';
import './Header.scss';

@graphql(
  gql`
    mutation {
      signOut
    }
  `,
  {
    name: 'signOut',
    options: {
      update: setIsLoggedIn(false)
    }
  }
)
@graphql(
  gql`
    mutation($email: String!, $password: String!) {
      signIn(email: $email, password: $password)
    }
  `,
  {
    name: 'signIn',
    options: {
      update: setIsLoggedIn(true)
    }
  }
)
@withRouter
export default class Header extends Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
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
      await this.props.signIn({
        variables: {
          email: authEmail,
          password: authPassword
        }
      });

      this.formStore.resetFormData();
      this.setState({ error: null });
      this.props.history.push('/records');
    } catch (err) {
      this.processAjaxError(err);
    }
  };

  onSignOut = async () => {
    await this.props.signOut();
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
