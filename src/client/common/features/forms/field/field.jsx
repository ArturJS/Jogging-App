import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field as FormikField, ErrorMessage } from 'formik';
// import './field.scss';

const Field = ({ className, name, component, placeholder, autoComplete }) => (
  <div className={cx('field', className)}>
    <FormikField
      name={name}
      component={component}
      className="field__control"
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
    <ErrorMessage name={name} />
  </div>
);

Field.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string
};

Field.defaultProps = {
  className: '',
  placeholder: '',
  autoComplete: ''
};

export default Field;
