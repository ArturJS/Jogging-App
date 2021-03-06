import React from 'react';
import TimePickerInput from './time-picker-input';

const timePicker = ({
    /* eslint-disable react/prop-types */
    field,
    form: { errors, submitCount, touched },
    className
    /* eslint-enable react/prop-types */
}) => {
    const { name, id } = field;
    const hasError = !!errors[name] && (submitCount > 0 || touched[name]);

    return (
        <TimePickerInput
            id={name || id}
            className={className}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            hasError={hasError}
        />
    );
};

export default timePicker;
