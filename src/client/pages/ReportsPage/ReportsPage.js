import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {inject, observer} from 'mobx-react';

import './ReportsPage.scss';

@inject('userStore')
@observer
export default class ReportsPage extends Component {
  static propTypes = {
    userStore: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="page reports-page">
        <Helmet title="Reports"/>
        <h1>Reports</h1>
      </div>
    );
  }
}
