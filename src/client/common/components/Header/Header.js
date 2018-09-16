import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../../graphql/queries';
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
@graphql(
  gql`
    mutation UpdateIsLoggedInMutation($isLoggedIn: Boolean!) {
      updateIsLoggedIn(isLoggedIn: $isLoggedIn) @client
    }
  `,
  {
    name: 'updateIsLoggedInMutation'
  }
)
@inject('userStore')
@withRouter
@observer
export default class Header extends Component {
  static propTypes = {
    signInMutation: PropTypes.func.isRequired,
    updateIsLoggedInMutation: PropTypes.func.isRequired,
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
      await this.props.updateIsLoggedInMutation({
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

  onSignOut = () => {
    this.props.userStore.doSignOut();
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
