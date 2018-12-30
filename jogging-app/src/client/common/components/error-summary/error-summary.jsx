import React from 'react';
import PropTypes from 'prop-types';
import './error-summary.scss';

const ErrorSummary = ({ error }) => {
    if (!error) return null;

    return (
        <div className="error-summary">
            <div className="error-item">{error}</div>
        </div>
    );
};

ErrorSummary.propTypes = {
    error: PropTypes.string
};

ErrorSummary.defaultProps = {
    error: null
};

export default ErrorSummary;
