import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Header from '../../components/header';
import NavSubHeader from '../../components/nav-sub-header';
import { ModalDialog } from '../../features/modal-dialog';
import config from '../../../../config';
import '../../styles/base.scss';
import './root-shell.scss';

export default class RootShell extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    const { children } = this.props;

    return (
      <div className="root-shell">
        <Helmet {...config.app.head} />
        <Header />
        <NavSubHeader />
        <div className="page-container">{children}</div>
        <ModalDialog />
      </div>
    );
  }
}
