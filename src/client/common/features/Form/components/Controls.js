import React from 'react';
import classNames from 'classnames';

export default {
  inputTextCtrl,
  textAreaCtrl,
  inputPasswordCtrl,
  inputPasswordCtrlWithShowBnt
};

function inputTextCtrl({name, value, maxLength, placeholder, onFocus, onChange, onBlur, onEnter, disabled, tabIndex, ctrl}) {
  function onEnterClick(e) {
    if (e.key !== 'Enter') return;
    onEnter(e);
  }

  return (
    <input
      tabIndex={tabIndex}
      type="text"
      id={name}
      name={name}
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      disabled={disabled}
      className="form-control field-anchor"
      onChange={onChange}
      onBlur={onBlur}
      ref={(input) => {
        ctrl.ref = input;
      }}
      onKeyPress={onEnterClick}
      onFocus={onFocus}/>
  );
}

function textAreaCtrl({name, value, maxLength, placeholder, onFocus, onChange, onBlur, onEnter, disabled, tabIndex, ctrl}) {
  function onEnterClick(e) {
    if (e.key !== 'Enter') return;
    onEnter(e);
  }

  return (
    <textarea
      rows="4"
      tabIndex={tabIndex}
      type="text"
      id={name}
      name={name}
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      disabled={disabled}
      className="form-control field-anchor"
      onChange={onChange}
      onBlur={onBlur}
      ref={(input) => {
        ctrl.ref = input;
      }}
      onKeyPress={onEnterClick}
      onFocus={onFocus}/>
  );
}

function inputPasswordCtrl({name, value, placeholder, onFocus, onChange, onBlur, onEnter, disabled, tabIndex, ctrl}) {
  function onEnterClick(e) {
    if (e.key !== 'Enter') return;
    onEnter(e);
  }

  return (
    <input
      tabIndex={tabIndex}
      type="password"
      id={name}
      name={name}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      className="form-control field-anchor"
      onChange={onChange}
      onBlur={onBlur}
      ref={(input) => {
        ctrl.ref = input;
      }}
      onKeyPress={onEnterClick}
      onFocus={onFocus}/>
  );
}

function inputPasswordCtrlWithShowBnt({name, value, placeholder, onFocus, onChange, onBlur, disabled, tabIndex, ctrl}) {
  let icon;
  const showPassword = () => {
    icon.classList.add('fa-eye');
    icon.classList.remove('fa-eye-slash');
    ctrl.ref.type = 'text';
  };

  const hidePassword = () => {
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
    ctrl.ref.type = 'password';
  };

  return (
    <div className="field-password-with-show-btn">
      <input
        tabIndex={tabIndex}
        type="password"
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        className="form-control"
        onChange={onChange}
        onBlur={onBlur}
        ref={(input) => {
          ctrl.ref = input;
        }}
        onFocus={onFocus}/>
      <span
        ref={(element) => {
          icon = element;
        }}
        className={
          classNames('field-icon fa',
            {
              'fa-eye-slash': ctrl.ref === undefined || ctrl.ref.type === 'password'
            },
            {
              'fa-eye': ctrl.ref && ctrl.ref.type === 'text'
            }
          )
        }
        onMouseDown={showPassword}
        onTouchStart={showPassword}
        onMouseUp={hidePassword}
        onTouchEnd={hidePassword}
        onMouseLeave={hidePassword}/>
    </div>
  );
}
