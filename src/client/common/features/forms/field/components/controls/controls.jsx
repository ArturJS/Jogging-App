import React, { Fragment } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import ScrollToError from '../scroll-to-error';
import './controls.scss';

const withScrollToError = renderControl => {
  return params => {
    const {
      form: { submitCount, errors, isValid },
      field: { name },
      ref
    } = params;

    return (
      <Fragment>
        <ScrollToError
          submitCount={submitCount}
          name={name}
          errors={errors}
          inputRef={ref}
          isValid={isValid}
        />
        {renderControl(params)}
      </Fragment>
    );
  };
};

const controls = {
  text: ({ field, form: { errors }, className, ...props }) => {
    const hasError = !!errors[field.name];

    return (
      <input
        type="text"
        className={cx(className, { 'field-error': hasError })}
        {...field}
        {...props}
      />
    );
  },

  password: ({ field, form: { errors }, className, ...props }) => {
    const hasError = !!errors[field.name];

    return (
      <input
        type="password"
        className={cx(className, { 'field-error': hasError })}
        {...field}
        {...props}
      />
    );
  },

  passwordShow: ({ field, form: { errors }, className, ...props }) => {
    let icon;
    const hasError = !!errors[field.name];
    const inputRef = props.ref.current;
    const showPassword = () => {
      icon.classList.add('fa-eye');
      icon.classList.remove('fa-eye-slash');
      inputRef.type = 'text';
    };
    const hidePassword = () => {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
      inputRef.type = 'password';
    };

    return (
      <div className="field-password-with-show-btn">
        <input
          type="password"
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
  }
};

export default _.mapValues(controls, renderControl =>
  withScrollToError(renderControl)
);
