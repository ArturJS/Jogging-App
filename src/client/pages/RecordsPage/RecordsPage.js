import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {inject, observer} from 'mobx-react';

import './RecordsPage.scss';

@inject('userStore')
@observer
export default class RecordsPage extends Component {
  static propTypes = {
    userStore: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="page records-page">
        <Helmet title="Records"/>
        <h1>Records</h1>
      </div>
    );
  }
}
