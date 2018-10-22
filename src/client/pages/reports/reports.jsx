import React, { Component } from 'react';
import Helmet from 'react-helmet';
import ReactTable from 'react-table';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import './reports.scss';

export const REPORTS_QUERY = gql`
  query {
    reports {
      week
      averageSpeed
      averageDistance
    }
  }
`;

export default class Reports extends Component {
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

  renderTable(rawReports = []) {
    const reports = rawReports.map(report => ({
      ...report,
      averageDistance: report.averageDistance.toFixed(2),
      averageSpeed: report.averageSpeed.toFixed(2)
    }));

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
