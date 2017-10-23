import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {inject} from 'mobx-react';

import Header from './components/Header';
import config from '../../../../config';
import '../../styles/base.scss';
import './RootShell.scss';

@inject('userStore')
export default class RootShell extends Component {
  static propTypes = {
    userStore: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.userStore.init();
  }

  render() {
    const {children} = this.props;

    return (
      <div className="root-shell">
        <Helmet {...config.app.head}/>
        <Header/>
        <div className="page-container">
          {children}
        </div>
      </div>
    );
  }
}
