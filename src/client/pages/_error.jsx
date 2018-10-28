import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { performRedirect } from 'next-routes';

export default class Error extends Component {
    static propTypes = {
        statusCode: PropTypes.number
    };

    static defaultProps = {
        statusCode: null
    };

    static getInitialProps({ req, res, err }) {
        // eslint-disable-next-line no-nested-ternary
        const statusCode = res ? res.statusCode : err ? err.statusCode : null;

        if (statusCode === 404) {
            const redirectTo = req.isAuthenticated() ? '/records' : '/sign-up';

            performRedirect({ req, res, redirectTo });
        }

        return { statusCode };
    }

    render() {
        const { statusCode } = this.props;

        return (
            <p>
                {statusCode
                    ? `An error ${statusCode} occurred on server`
                    : 'An error occurred on client'}
            </p>
        );
    }
}
