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
    className: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.string
  };

  static defaultProps = {
    className: '',
    placeholder: '',
    autoComplete: 'nope'
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
    const { className, name, placeholder, autoComplete } = this.props;

    return (
      <div className={cx('field', className)}>
        <FormikField
          name={name}
          className="field__control"
          placeholder={placeholder}
          autoComplete={autoComplete}
          component={this.renderControl}
        />
        <small className="field-error-text">
          &nbsp;
          <ErrorMessage name={name} />
        </small>
      </div>
    );
  }
}
