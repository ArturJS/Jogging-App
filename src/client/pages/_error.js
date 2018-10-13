import React from 'react';
import { performRedirect } from 'next-routes';

export default class Error extends React.Component {
  static getInitialProps({ req, res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;

    if (statusCode === 404) {
      const redirectTo = req.isAuthenticated() ? '/records' : '/sign-up';

      performRedirect({ req, res, redirectTo });
    }

    return { statusCode };
  }

  render() {
    return (
      <p>
        {this.props.statusCode
          ? `An error ${this.props.statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    );
  }
}
