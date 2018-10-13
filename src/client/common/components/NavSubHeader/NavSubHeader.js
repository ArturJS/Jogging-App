import React, { Component } from 'react';
import { Router, Link } from 'routes';
import './NavSubHeader.scss';

export default class NavSubHeader extends Component {
  state = {
    visible: false
  };

  componentDidMount() {
    this.updateVisibility(window.location.pathname);
    Router.events.on('routeChangeComplete', this.updateVisibility);
  }

  componentWillUnmount() {
    Router.events.off('routeChangeComplete', this.updateVisibility);
  }

  updateVisibility = url => {
    this.setState({
      visible: /\/records|\/reports/.test(url)
    });
  };

  render() {
    const { visible } = this.state;

    if (!visible) return null;

    return (
      <ul className="nav-sub-header list-unstyled">
        <li className="nav-item">
          <Link
            className="nav-link unstyled-link"
            route="records"
            activeClassName="active"
          >
            Records
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link unstyled-link"
            route="reports"
            activeClassName="active"
          >
            Reports
          </Link>
        </li>
      </ul>
    );
  }
}
