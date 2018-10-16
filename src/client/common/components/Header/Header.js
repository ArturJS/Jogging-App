import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { Router } from 'routes';
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
export default class Header extends Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired
  };

  state = {
    error: null
  };

  componentWillMount() {
    this.formStore = new FormStore({
      email: {
        value: '',
        validators: [Validators.required(true)]
      },
      password: {
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

    try {
      await this.performSignIn();

      this.formStore.resetFormData();
      this.setState({ error: null });
      Router.pushRoute('records');
    } catch (error) {
      this.setState({ error });
    }
  };

  onSignOut = async () => {
    await this.props.signOut();
    Router.pushRoute('sign-up');
  };

  performSignIn = async () => {
    const { email, password } = this.formStore.values;
    const { errors } = await this.props.signIn({
      variables: {
        email,
        password
      },
      errorPolicy: 'all'
    });
    const error = _.get(errors, '[0].message');

    if (error) {
      throw error;
    }
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
          id={null}
          className="control-field"
          name="email"
          control={inputTextCtrl}
          placeholder={'Email'}
        />
        <Field
          id={null}
          className="control-field"
          name="password"
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
      <Query query={IS_LOGGED_IN} fetchPolicy="cache-and-network">
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
