import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

const Form = ({
  initialValues,
  validationSchema,
  onSubmit,
  className,
  children
}) => (
  <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
    enableReinitialize={true}
    render={props => (
      <form className={className} onSubmit={props.handleSubmit} noValidate>
        {children}
      </form>
    )}
  />
);

Form.propTypes = {
  validationSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  className: PropTypes.string
};

Form.defaultProps = {
  initialValues: {},
  className: ''
};

export default Form;
