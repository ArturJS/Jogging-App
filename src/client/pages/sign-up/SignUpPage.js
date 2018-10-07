import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import _ from 'lodash';
import { Router } from 'routes';
import ErrorSummary from '../../common/components/ErrorSummary';
import {
  FormStore,
  Form,
  Field,
  Validators,
  Controls
} from '../../common/features/Form';
import { setIsLoggedIn } from '../../common/graphql/utils';
import './SignUpPage.scss';

const SIGN_UP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $repeatPassword: String!
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      repeatPassword: $repeatPassword
    )
  }
`;

@graphql(SIGN_UP, {
  name: 'signUp',
  options: {
    update: setIsLoggedIn(true)
  }
})
class SignUpPage extends Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired
  };

  state = {
    error: null
  };

  componentWillMount() {
    this.formStore = new FormStore({
      firstName: {
        value: '',
        maxLength: 254,
        validators: [
          Validators.required('Please enter your first name'),
          Validators.regex(/^(\s*[A-Za-z\-\']+)+\s*$/)
        ]
      },
      lastName: {
        value: '',
        maxLength: 254,
        validators: [
          Validators.required('Please enter your surname'),
          Validators.regex(/^(\s*[A-Za-z\-\']+)+\s*$/)
        ]
      },
      email: {
        value: '',
        maxLength: 254,
        validators: [
          Validators.required('Please enter your email'),
          Validators.email('Please enter email in the correct format'),
          Validators.minLength(6, 'Please enter email in the correct format')
        ]
      },
      password: {
        value: '',
        maxLength: 254,
        validators: [
          Validators.required('Please enter your password'),
          Validators.minLength(
            8,
            'Password is too short. Minimal length - 8 characters.'
          ),
          Validators.maxLength(30, 'Maximum password length is 30 characters.')
        ]
      },
      repeatPassword: {
        value: '',
        maxLength: 254,
        validators: [
          Validators.required('Please repeat your password'),
          (value, values) => {
            if (values.password !== value) {
              return 'The password and repeat password do not match.';
            }
            return null;
          }
        ]
      }
    });
  }

  async performSignUp() {
    const {
      firstName,
      lastName,
      email,
      password,
      repeatPassword
    } = this.formStore.values;

    const { errors } = await this.props.signUp({
      variables: {
        firstName,
        lastName,
        email,
        password,
        repeatPassword
      },
      errorPolicy: 'all'
    });
    const error = _.get(errors, '[0].message');

    if (error) {
      throw error;
    }
  }

  onSubmit = async () => {
    if (!this.formStore.validate().valid) {
      this.formStore.setFocusFirstInvalid();
      return;
    }

    try {
      await this.performSignUp();

      this.formStore.resetFormData();
      this.setState({ error: null });
      Router.pushRoute('records');
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    const { error } = this.state;
    const { inputTextCtrl, inputPasswordCtrlWithShowBnt } = Controls;

    return (
      <div className="page sign-up-page">
        <Helmet title="Create an account" />
        <Form
          className="sign-up-form"
          store={this.formStore}
          onSubmit={this.onSubmit}
        >
          <h2 className="text-center">Create an account</h2>
          <div className="form-group">
            <label htmlFor="firstName" className="control-label">
              First name
            </label>
            <Field
              className="control-field"
              name="firstName"
              control={inputTextCtrl}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="control-label">
              Surname
            </label>
            <Field
              className="control-field"
              name="lastName"
              control={inputTextCtrl}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="control-label">
              Email
            </label>
            <Field
              className="control-field"
              name="email"
              control={inputTextCtrl}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="control-label">
              Password
            </label>
            <Field
              className="control-field"
              name="password"
              control={inputPasswordCtrlWithShowBnt}
            />
          </div>
          <div className="form-group">
            <label htmlFor="repeatPassword" className="control-label">
              Repeat password
            </label>
            <Field
              className="control-field"
              name="repeatPassword"
              control={inputPasswordCtrlWithShowBnt}
            />
          </div>
          <ErrorSummary error={error} />
          <div className="buttons-group">
            <button type="submit" className="btn btn-primary">
              Create an account
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

export default SignUpPage;
