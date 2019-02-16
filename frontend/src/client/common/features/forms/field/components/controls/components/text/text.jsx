/* eslint-disable react/prop-types */
// since it's just a function (not a react component)

import React from 'react';
import cx from 'classnames';

const text = ({
    field,
    form: { errors, submitCount, touched },
    className,
    ...props
}) => {
    const { name } = field;
    const hasError = !!errors[name] && (submitCount > 0 || touched[name]);

    return (
        <input
            type="text"
            className={cx(className, { 'field-error': hasError })}
            {...field}
            {...props}
        />
    );
};

export default text;
