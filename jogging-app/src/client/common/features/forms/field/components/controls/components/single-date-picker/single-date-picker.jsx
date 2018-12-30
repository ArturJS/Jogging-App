import React from 'react';
import DatePicker from './date-picker';

// eslint-disable-next-line react/prop-types
const singleDatePicker = ({ field }) => (
    <DatePicker
        id={field.id}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
    />
);

export default singleDatePicker;
