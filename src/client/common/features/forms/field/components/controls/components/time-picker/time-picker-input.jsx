import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import RcTimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

export default class TimePickerInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    value: PropTypes.object,
    className: PropTypes.string
  };

  static defaultProps = {
    value: null
  };

  handleChange = value => {
    const { onChange, name } = this.props;

    onChange({
      target: {
        name,
        value
      }
    });
  };

  render() {
    const { name, value, hasError, className, id } = this.props;

    return (
      <RcTimePicker
        id={id}
        className={cx(className, { 'field-error': hasError })}
        name={name}
        value={value}
        showSecond={true}
        defaultValue={moment().startOf('day')}
        onChange={this.handleChange}
      />
    );
  }
}
