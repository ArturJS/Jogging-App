import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';

import {FormStore, Form, Field, Controls, Validators} from '../../../../features/Form';
import './Header.scss';

@inject('userStore')
@observer
export default class Header extends Component {
  static propTypes = {
    userStore: PropTypes.object.isRequired
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

  onSignIn = () => {
    if (!this.formStore.validate().valid) {
      this.formStore.setFocusFirstInvalid();
      return;
    }

    const {authEmail, authPassword} = this.formStore.values;

    this.props.userStore.doSignIn({
      email: authEmail,
      password: authPassword
    });
  };

  onSignOut = () => {
    this.props.userStore.doSignOut();
  };

  render() {
    const {userStore} = this.props;
    const {isLoggedIn} = userStore;
    const {
      inputTextCtrl,
      inputPasswordCtrl
    } = Controls;

    return (
      <div className="header">
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
