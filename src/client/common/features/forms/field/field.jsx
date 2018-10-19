import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field as FormikField, ErrorMessage } from 'formik';
import controls from './controls';
// import './field.scss';

const Field = ({ className, name, component, placeholder }) => (
  <div className={cx('field', className)}>
    <FormikField
      name={name}
      component={controls[component]}
      className="field__control"
      placeholder={placeholder}
    />
    <small className="field-error-text form-text">
      &nbsp;
      <ErrorMessage name={name} />
    </small>
  </div>
);

Field.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.oneOf(Object.keys(controls)).isRequired,
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
