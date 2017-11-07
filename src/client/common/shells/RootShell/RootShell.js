import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {inject} from 'mobx-react';

import Header from '../../components/Header';
import NavSubHeader from '../../components/NavSubHeader';
import LoadingScreen from '../../components/LoadingScreen';
import {ModalDialog} from '../../features/ModalDialog';
import config from '../../../../config';
import '../../styles/base.scss';
import './RootShell.scss';

@inject('userStore')
export default class RootShell extends Component {
  static propTypes = {
    userStore: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
  };

  componentWillMount() {
    if (__CLIENT__) {
      this.initGlobalInitialAppState();
      this.props.userStore.init();
    }
  }

  initGlobalInitialAppState() {
    try {
      window.__INITIAL_APP_STATE__ = JSON.parse(
        document.getElementById('initial_app_state').innerHTML
      );
    }
    catch (err) {
      console.error(err);
    }
  }

  render() {
    const {children} = this.props;

    return (
      <div className="root-shell">
        <Helmet {...config.app.head}/>
        <Header/>
        <NavSubHeader/>
        <div className="page-container">
          {children}
        </div>
        <ModalDialog/>
        <LoadingScreen/>
      </div>
    );
  }
}
