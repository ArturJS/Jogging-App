import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field as FormikField, ErrorMessage } from 'formik';
import controls from './components/controls';
import './field.scss';

export default class Field extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.oneOf(Object.keys(controls)).isRequired,
    id: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string
  };

  static defaultProps = {
    className: '',
    label: ''
  };

  renderControl = params => {
    const { component } = this.props;
    const control = controls[component];

    return control({
      ...params,
      ref: this.inputRef
    });
  };

  render() {
    const { className, name, label } = this.props;
    const { id = name, placeholder = label } = this.props;
    const hasLabel = !!label;

    return (
      <div className={cx('field', className)}>
        {hasLabel && (
          <label htmlFor={id} className="field__label">
            {label}
          </label>
        )}
        <FormikField
          id={id}
          name={name}
          className="field__control"
          placeholder={placeholder}
          component={this.renderControl}
        />
        <small className="field__error">
          &nbsp;
          <ErrorMessage name={name} />
        </small>
      </div>
    );
  }
}
