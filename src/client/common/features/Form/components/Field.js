import React, {Component} from 'react';
import {observer} from 'mobx-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Controls from './Controls';

@observer
export default class Field extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    hideError: PropTypes.bool,
    className: PropTypes.string
  };

  static contextTypes = {
    store: PropTypes.object,
    isMobile: PropTypes.bool
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.context.store !== nextContext.store;
  }

  getCtrl() {
    return this.context.store.getCtrl(this.props.name);
  }

  onChange = (e) => {
    const ctrl = this.getCtrl();
    ctrl.touched = true;
    let value = e;

    // if standard form inputs
    let target = e && e.target;
    if (target) {
      value = (target.type === 'checkbox' || target.dataset.type === 'checkbox') ? target.checked : target.value;
    }

    if (_.isString(value)) {
      value = _.trimStart(value);
    }
    let newValue = ctrl.transform(value, ctrl.value, ctrl);
    ctrl.isDifirenceExist = ctrl.value !== value;
    ctrl.value = newValue;
    ctrl.error = this.context.store.validateCtrl(ctrl);
    ctrl.onChanged(ctrl, this.context.store.ctrlsData, this.context.store);
  };

  onBlur = () => {
    const ctrl = this.getCtrl();
    if (ctrl.touched) {
      ctrl.value = ctrl.onBlurTransform(ctrl.value, ctrl);
      if (ctrl.asyncValidators.length) {
        this.context.store.asyncValidateCtrl(this.props.name);
      }
      if (ctrl.onBlured) {
        ctrl.onBlured(ctrl, this.context.store.ctrlsData);
      }
      ctrl.error = this.context.store.validateCtrl(ctrl);
    }
  };

  onFocus = ({focused}) => {
    let ctrl = this.getCtrl();
    ctrl.value = ctrl.onFocusTransform(ctrl.value, ctrl);
    ctrl.touched = true;
    if (_.isBoolean(focused)) {
      ctrl.focused = focused;
    }
  };

  onEnter = (e) => {
    let ctrl = this.getCtrl();
    ctrl.onEnter(e);
  };

  render() {
    let {name, control, placeholder, hideError, className, tabIndex, children} = this.props;
    let {value, error, touched, options, disabled, maxLength} = this.getCtrl();

    // to fix bug in Safari when the text inserted by js overlaps placeholders in text inputs
    const {
      inputTextCtrl,
      prefixPhoneInputCtrl,
      prefixInputCtrl,
      inputCheckboxWithLabelCtrl,
      inputPasswordCtrlWithShowBnt
    } = Controls;
    if ([inputTextCtrl, prefixInputCtrl, prefixPhoneInputCtrl].indexOf(control) > -1 && value !== '') {
      placeholder = '';
    }
    let completedPlaceholder;
    if ([inputCheckboxWithLabelCtrl, inputPasswordCtrlWithShowBnt].indexOf(control) > -1) {
      completedPlaceholder = placeholder;
    }
    else {
      completedPlaceholder = disabled ? '' : placeholder;
    }
    let controlProps = {
      ...this.props,
      children,
      name,
      value,
      placeholder: completedPlaceholder,
      options,
      disabled,
      maxLength,
      touched,
      error,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onEnter: this.onEnter,
      tabIndex,
      isMobile: this.context.isMobile,
      ctrl: this.getCtrl()
    };

    const controlEl = control(controlProps);

    return (
      <div className={classNames('field', {[className]: !!className, 'field-error': error})}>
        {controlEl}
        {!hideError && error &&
          <small className="field-error-text form-text">{error}</small>
        }
      </div>
    );
  }
}
