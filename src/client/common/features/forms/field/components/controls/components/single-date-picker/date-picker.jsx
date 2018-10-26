import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

export default class DatePicker extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object
  };

  static defaultProps = {
    value: null
  };

  state = {
    isFocused: false
  };

  enableAnyDates = () => false;

  handleChange = value => {
    const { name, onChange } = this.props;

    onChange({
      target: {
        value,
        name
      }
    });
    this.setState({
      isFocused: false
    });
  };

  handleFocus = ({ focused }) => {
    this.setState({
      isFocused: focused
    });
  };

  render() {
    const { id, value } = this.props;
    const { isFocused } = this.state;

    return (
      <SingleDatePicker
        id={id}
        date={value}
        onDateChange={this.handleChange}
        focused={isFocused}
        onFocusChange={this.handleFocus}
        displayFormat="DD.MM.YYYY"
        isOutsideRange={this.enableAnyDates}
        numberOfMonths={1}
      />
    );
  }
}
