import React, { Component } from 'react';
import Helmet from 'react-helmet';
import ReactTable from 'react-table';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import './ReportsPage.scss';

const REPORTS_QUERY = gql`
  query {
    reports {
      week
      averageSpeed
      averageDistance
    }
  }
`;

export default class ReportsPage extends Component {
  gridColumns = [
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
  ];

  renderNoReports() {
    return (
      <div className="no-reports-placeholder">
        <p>There are no records to display reports...</p>
      </div>
    );
  }

  renderTable(reports = []) {
    return (
      <ReactTable
        className={'reports-table'}
        data={reports}
        columns={this.gridColumns}
        pageSize={reports.length}
        showPageSizeOptions={false}
        showPagination={false}
      />
    );
  }

  render() {
    return (
      <div className="page reports-page">
        <Helmet title="Reports" />
        <h1>Reports</h1>

        <Query query={REPORTS_QUERY}>
          {({ loading, data: { reports } }) =>
            loading ? (
              <div>Loading...</div>
            ) : !reports || reports.length === 0 ? (
              this.renderNoReports()
            ) : (
              this.renderTable(reports || [])
            )
          }
        </Query>
      </div>
    );
  }
}
