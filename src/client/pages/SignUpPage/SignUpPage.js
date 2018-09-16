import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import { loginApi } from '../../common/api/loginApi';
import processErrors from '../../common/components/ProcessErrors';
import ErrorSummary from '../../common/components/ErrorSummary';
import {
  FormStore,
  Form,
  Field,
  Validators,
  Controls
} from '../../common/features/Form';
import { UPDATE_IS_LOGGED_IN } from '../../common/graphql/mutations';
import './SignUpPage.scss';

@graphql(UPDATE_IS_LOGGED_IN, {
  name: 'updateIsLoggedIn'
})
@processErrors
@withRouter
export default class SignUpPage extends Component {
  static propTypes = {
    updateIsLoggedIn: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    error: PropTypes.string,
    processAjaxError: PropTypes.func.isRequired
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

  onSubmit = async () => {
    if (!this.formStore.validate().valid) {
      this.formStore.setFocusFirstInvalid();
      return;
    }

    const {
      firstName,
      lastName,
      email,
      password,
      repeatPassword
    } = this.formStore.values;

    try {
      await loginApi.doSignUp(
        {
          firstName,
          lastName,
          email,
          password,
          repeatPassword
        },
        { showLoading: true }
      );
      await this.props.updateIsLoggedIn({
        variables: {
          isLoggedIn: true
        }
      });
      this.formStore.resetFormData();
      this.setState({ error: null });
      this.props.history.push('/records');
    } catch (err) {
      this.props.processAjaxError(err);
    }
  };

  render() {
    const { error } = this.props;
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
