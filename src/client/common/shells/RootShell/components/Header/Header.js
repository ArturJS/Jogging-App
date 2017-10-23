import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

import {FormStore, Form, Field, Controls, Validators} from '../../../../features/Form';
import './Header.scss';

@inject('userStore')
@observer
export default class Header extends Component {
  static propTypes = {
    userStore: PropTypes.object.isRequired
  };

  state = {
    error: null
  };

  componentWillMount() {
    this.formStore = new FormStore({
      authEmail: {
        value: '',
        validators: [
          Validators.required(true)
        ]
      },
      authPassword: {
        value: '',
        validators: [
          Validators.required(true)
        ]
      }
    });
  }

  onSignIn = async() => {
    if (!this.formStore.validate().valid) {
      this.formStore.setFocusFirstInvalid();
      return;
    }

    const {authEmail, authPassword} = this.formStore.values;

    try {
      await this.props.userStore.doSignIn({
        email: authEmail,
        password: authPassword
      });
      this.formStore.resetFormData();
      this.setState({error: null});
    }
    catch (err) {
      this.processAjaxError(err);
    }
  };

  onSignOut = () => {
    this.props.userStore.doSignOut();
  };

  processAjaxError = (err) => {
    const {error} = err.response.data;
    this.setState({error});
  };

  render() {
    const {error} = this.state;
    const {isLoggedIn} = this.props.userStore;
    const {
      inputTextCtrl,
      inputPasswordCtrl
    } = Controls;

    return (
      <div className={classNames('header', {'is-logged-in': isLoggedIn})}>
        <div className="header-brand">
          Jogging App
        </div>
        <div className="header-auth">
          {isLoggedIn &&
          <button
            type="button"
            className="btn btn-default"
            onClick={this.onSignOut}>
            Logout
          </button>
          }
          {!isLoggedIn &&
          <Form
            className="login-form"
            store={this.formStore}
            onSubmit={this.onSignIn}>
            <Field
              className="control-field"
              name="authEmail"
              control={inputTextCtrl}
              placeholder={'Email'}/>
            <Field
              className="control-field"
              name="authPassword"
              control={inputPasswordCtrl}
              placeholder={'Password'}/>
            {error &&
            <div className="login-error-summary field-error-text">
              {error}
            </div>
            }
            <button
              type="submit"
              className="btn btn-default btn-submit">
              Log In
            </button>
          </Form>
          }
        </div>
      </div>
    );
  }
}
