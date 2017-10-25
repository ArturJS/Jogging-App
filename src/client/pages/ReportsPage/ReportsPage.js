import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {inject, observer} from 'mobx-react';
import ReactTable from 'react-table';

import './ReportsPage.scss';

@inject('userStore')
@observer
export default class ReportsPage extends Component {
  static propTypes = {
    userStore: PropTypes.object.isRequired
  };

  state = {
    reportsGrid: {}
  };

  componentWillMount() {
    this.setState({
      reportsGrid: {
        data: [
          {
            week: '1',
            averageDistance: '11',
            averageSpeed: '11'
          },
          {
            week: '2',
            averageDistance: '22',
            averageSpeed: '22'
          },
          {
            week: '3',
            averageDistance: '33',
            averageSpeed: '33'
          }
        ],
        columns: [
          {
            Header: 'Week',
            accessor: 'week',
            width: 150,
            sortable: true
          },
          {
            Header: () => (
              <div>
                <div>Average distance</div>
                <div>(Metres)</div>
              </div>
            ),
            accessor: 'averageDistance',
            sortable: false
          },
          {
            Header: () => (
              <div>
                <div>Average speed</div>
                <div>(Km/hr)</div>
              </div>
            ),
            accessor: 'averageSpeed',
            sortable: false
          }
        ]
      }
    });
  }

  render() {
    const {reportsGrid} = this.state;

    return (
      <div className="page reports-page">
        <Helmet title="Reports"/>
        <h1>Reports</h1>

        {reportsGrid.data.length === 0 &&
        <div className="no-reports-placeholder">
          <p>There are no records to display reports...</p>
        </div>
        }

        {reportsGrid.data.length > 0 &&
        <ReactTable
          className={'reports-table'}
          data={reportsGrid.data}
          columns={reportsGrid.columns}
          pageSize={reportsGrid.data.length}
          showPageSizeOptions={false}
          showPagination={false}/>
        }
      </div>
    );
  }
}
