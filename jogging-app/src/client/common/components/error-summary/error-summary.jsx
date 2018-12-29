import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './error-summary.scss';

export default class ErrorSummary extends Component {
    static propTypes = {
        error: PropTypes.string
    };

    render() {
        const { error } = this.props;

        if (!error) return null;

        return (
            <div className="error-summary">
                <div className="error-item">{error}</div>
            </div>
        );
    }
}
