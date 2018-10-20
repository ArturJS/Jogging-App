import React, { Fragment } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import ScrollToError from './scroll-to-error';

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
  }
};

export default _.mapValues(controls, renderControl =>
  withScrollToError(renderControl)
);
