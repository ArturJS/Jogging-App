import React from 'react';
import cx from 'classnames';

const passwordShow = ({ field, form, className, ...props }) => {
  let icon;

  const { errors, submitCount, touched } = form;
  const { name } = field;
  const hasError = !!errors[name] && (submitCount > 0 || touched[name]);
  const inputRef = props.ref.current;
  const showPassword = () => {
    icon.classList.add('fa-eye');
    icon.classList.remove('fa-eye-slash');
    inputRef && (inputRef.type = 'text');
  };
  const hidePassword = () => {
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
    inputRef && (inputRef.type = 'password');
  };

  return (
    <div className="field-password-with-show-btn">
      <input type="password" name="fakepasswordremembered" />
      <input
        type="password"
        autoComplete="new-password"
        className={cx(className, { 'field-error': hasError })}
        {...field}
        {...props}
      />
      <span
        ref={element => {
          icon = element;
        }}
        className={cx(
          'field-icon fa',
          {
            'fa-eye-slash': !inputRef || inputRef.type === 'password'
          },
          {
            'fa-eye': inputRef && inputRef.type === 'text'
          }
        )}
        onMouseDown={showPassword}
        onTouchStart={showPassword}
        onMouseUp={hidePassword}
        onTouchEnd={hidePassword}
        onMouseLeave={hidePassword}
      />
    </div>
  );
};

export default passwordShow;
