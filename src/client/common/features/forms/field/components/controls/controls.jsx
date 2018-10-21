import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import 'rc-time-picker/assets/index.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';
import RcTimePicker from 'rc-time-picker';
import moment from 'moment';
import ScrollToError from '../scroll-to-error';
import './controls.scss';

class DatePicker extends Component {
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

class TimePicker extends Component {
  static propTypes = {
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
    const { name, value, hasError, className } = this.props;

    return (
      <RcTimePicker
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

const withScrollToError = renderControl => {
  return params => {
    const {
      form: { submitCount, errors, isValid },
      field: { name },
      ref
    } = params;

    return (
      <Fragment>
        <ScrollToError
          submitCount={submitCount}
          name={name}
          errors={errors}
          inputRef={ref}
          isValid={isValid}
        />
        {renderControl(params)}
      </Fragment>
    );
  };
};

const controls = {
  text: ({ field, form: { errors }, className, ...props }) => {
    const hasError = !!errors[field.name];

    return (
      <input
        type="text"
        className={cx(className, { 'field-error': hasError })}
        {...field}
        {...props}
      />
    );
  },

  password: ({ field, form: { errors }, className, ...props }) => {
    const hasError = !!errors[field.name];

    return (
      <input
        type="password"
        className={cx(className, { 'field-error': hasError })}
        {...field}
        {...props}
      />
    );
  },

  passwordShow: ({ field, form: { errors }, className, ...props }) => {
    let icon;
    const hasError = !!errors[field.name];
    const inputRef = props.ref.current;
    const showPassword = () => {
      icon.classList.add('fa-eye');
      icon.classList.remove('fa-eye-slash');
      inputRef.type = 'text';
    };
    const hidePassword = () => {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
      inputRef.type = 'password';
    };

    return (
      <div className="field-password-with-show-btn">
        <input
          type="password"
          className={cx(className, { 'field-error': hasError })}
          {...field}
          {...props}
        />
        <span
          ref={element => {
            icon = element;
          }}
          className={cx(
            'field-icon fa',
            {
              'fa-eye-slash': !inputRef || inputRef.type === 'password'
            },
            {
              'fa-eye': inputRef && inputRef.type === 'text'
            }
          )}
          onMouseDown={showPassword}
          onTouchStart={showPassword}
          onMouseUp={hidePassword}
          onTouchEnd={hidePassword}
          onMouseLeave={hidePassword}
        />
      </div>
    );
  },

  singleDatePicker: ({ field }) => {
    return (
      <DatePicker
        id={field.name}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
      />
    );
  },

  timePicker: ({ field, form: { errors }, className }) => {
    const hasError = !!errors[field.name];

    return (
      <TimePicker
        className={className}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        hasError={hasError}
      />
    );
  }
};

export default _.mapValues(controls, renderControl =>
  withScrollToError(renderControl)
);
