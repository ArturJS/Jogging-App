import React from 'react';
import DatePicker from './date-picker';

const singleDatePicker = ({ field }) => {
  return (
    <DatePicker
      id={field.id}
      name={field.name}
      value={field.value}
      onChange={field.onChange}
    />
  );
};

export default singleDatePicker;
