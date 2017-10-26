import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';

import './LoadingScreen.scss';

@inject('loadingStore')
@observer
export default class LoadingScreen extends Component {
  static propTypes = {
    loadingStore: PropTypes.object.isRequired
  };

  render() {
    const {isLoading} = this.props.loadingStore;

    if (!isLoading) return null;

    return (
      <div className="loading-screen">
        <div className="loader"/>
      </div>
    );
  }
}
