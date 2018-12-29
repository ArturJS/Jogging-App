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
            enableReinitialize
            render={props => (
                <form
                    className={className}
                    // eslint-disable-next-line react/prop-types
                    onSubmit={props.handleSubmit}
                    noValidate
                >
                    {children}
                </form>
            )}
        />
    );

Form.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    validationSchema: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    initialValues: PropTypes.object,
    className: PropTypes.string
};

Form.defaultProps = {
    initialValues: {},
    className: ''
};

export default Form;
