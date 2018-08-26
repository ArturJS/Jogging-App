import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import ReactTable from 'react-table';
import { graphql } from 'react-apollo';
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

@graphql(REPORTS_QUERY, {
  name: 'reportsQuery'
})
export default class ReportsPage extends Component {
  static propTypes = {
    reportsQuery: PropTypes.object.isRequired
  };

  state = {
    reportsGrid: {}
  };

  componentWillMount() {
    this.setState({
      reportsGrid: {
        data: [],
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

  componentWillReceiveProps(nextProps) {
    const { reports } = nextProps.reportsQuery;

    this.updateReports(reports);
  }

  updateReports(reports) {
    this.setState(({ reportsGrid }) => ({
      reportsGrid: {
        data: reports,
        columns: reportsGrid.columns
      }
    }));
  }

  render() {
    const { reportsGrid } = this.state;

    return (
      <div className="page reports-page">
        <Helmet title="Reports" />
        <h1>Reports</h1>

        {reportsGrid.data.length === 0 && (
          <div className="no-reports-placeholder">
            <p>There are no records to display reports...</p>
          </div>
        )}

        {reportsGrid.data.length > 0 && (
          <ReactTable
            className={'reports-table'}
            data={reportsGrid.data}
            columns={reportsGrid.columns}
            pageSize={reportsGrid.data.length}
            showPageSizeOptions={false}
            showPagination={false}
          />
        )}
      </div>
    );
  }
}
