import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// import {withRouter} from 'react-router';

import './NavSubHeader.scss';

// @withRouter
export default class NavSubHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  state = {
    visible: false
  };

  // todo fix
  // componentDidMount() {
  //   this.updateVisibility(this.props.location);
  //   this.unlinsten = this.props.history.listen(this.updateVisibility);
  // }

  // componentWillUnmount() {
  //   this.unlinsten();
  // }

  // updateVisibility = ({ pathname }) => {
  //   this.setState({
  //     visible: /\/records|\/reports/.test(pathname)
  //   });
  // };

  render() {
    const { visible } = this.state;

    if (!visible) return null;

    return (
      <ul className="nav-sub-header list-unstyled">
        <li className="nav-item">
          <NavLink
            className="nav-link unstyled-link"
            to="/records"
            activeClassName="active"
          >
            Records
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            className="nav-link unstyled-link"
            to="/reports"
            activeClassName="active"
          >
            Reports
          </NavLink>
        </li>
      </ul>
    );
  }
}
