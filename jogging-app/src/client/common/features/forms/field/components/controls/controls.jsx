import React, { Fragment } from 'react';
import _ from 'lodash';
import ScrollToError from '../scroll-to-error';
import text from './components/text';
import password from './components/password';
import passwordShow from './components/password-show';
import singleDatePicker from './components/single-date-picker';
import timePicker from './components/time-picker';
import './controls.scss';

const withScrollToError = renderControl => params => {
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

const controls = {
    text,
    password,
    passwordShow,
    singleDatePicker,
    timePicker
};

export default _.mapValues(controls, renderControl =>
    withScrollToError(renderControl)
);
