import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field as FormikField, ErrorMessage } from 'formik';
import controls from './components/controls';
import './field.scss';

export default class Field extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        component: PropTypes.oneOf(Object.keys(controls)).isRequired,
        // eslint-disable-next-line react/require-default-props
        id: PropTypes.string,
        className: PropTypes.string,
        // eslint-disable-next-line react/require-default-props
        placeholder: PropTypes.string,
        label: PropTypes.string
    };

    static defaultProps = {
        className: '',
        label: ''
    };

    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

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
                    // eslint-disable-next-line jsx-a11y/label-has-for
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
