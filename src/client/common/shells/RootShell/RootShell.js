import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Header from '../../components/Header';
import NavSubHeader from '../../components/NavSubHeader';
import LoadingScreen from '../../components/LoadingScreen';
import { ModalDialog } from '../../features/ModalDialog';
import config from '../../../../config';
import '../../styles/base.scss';
import './RootShell.scss';

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
        <LoadingScreen />
      </div>
    );
  }
}
