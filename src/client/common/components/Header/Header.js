import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

import {
  FormStore,
  Form,
  Field,
  Controls,
  Validators
} from '../../features/Form';
import './Header.scss';

const SIGN_IN_MUTATION = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(signIn: { email: $email, password: $password }) {
      email
      firstName
      lastName
    }
  }
`;

@graphql(SIGN_IN_MUTATION, {
  name: 'signInMutation'
})
@inject('userStore')
@withRouter
@observer
export default class Header extends Component {
  static propTypes = {
    signInMutation: PropTypes.func.isRequired,
    userStore: PropTypes.object.isRequired,
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
      const {
        data: {
          signIn: { email, firstName, lastName }
        }
      } = await this.props.signInMutation({
        variables: {
          email: authEmail,
          password: authPassword
        }
      });

      this.props.userStore.setUserData({
        email,
        firstName,
        lastName
      });

      this.formStore.resetFormData();
      this.setState({ error: null });
    } catch (err) {
      this.processAjaxError(err);
    }
  };

  onSignOut = () => {
    this.props.userStore.doSignOut();
    this.props.history.push('/sign-up');
  };

  processAjaxError = err => {
    const { error } = err.response.data;
    this.setState({ error });
  };

  render() {
    const { error } = this.state;
    const { isLoggedIn } = this.props.userStore;
    const { inputTextCtrl, inputPasswordCtrl } = Controls;

    return (
      <div className={classNames('header', { 'is-logged-in': isLoggedIn })}>
        <div className="header-brand">Jogging App</div>
        <div className="header-auth">
          {isLoggedIn && (
            <button
              type="button"
              className="btn btn-default"
              onClick={this.onSignOut}
            >
              Logout
            </button>
          )}
          {!isLoggedIn && (
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
                <div className="login-error-summary field-error-text">
                  {error}
                </div>
              )}
              <button type="submit" className="btn btn-default btn-submit">
                Log In
              </button>
            </Form>
          )}
        </div>
      </div>
    );
  }
}
