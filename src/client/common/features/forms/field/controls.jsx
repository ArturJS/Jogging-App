import React from 'react';
import cx from 'classnames';

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
  }
};

export default controls;
