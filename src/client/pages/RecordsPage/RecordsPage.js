import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { inject, observer } from 'mobx-react';
import ReactTable from 'react-table';
import moment from 'moment';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import EditRecordModal from './components/EditRecordModal';
import DateRangeFilter from './components/DateRangeFilter';
import './RecordsPage.scss';

// todo move data transformations to utils
const convertToMomentDate = timeInSeconds => {
  const HOUR = 3600;
  const MINUTE = 60;

  const hours = Math.floor(timeInSeconds / HOUR);
  const minutes = Math.floor((timeInSeconds - hours * HOUR) / MINUTE);
  const seconds = timeInSeconds - hours * HOUR - minutes * MINUTE;

  return moment({ hours, minutes, seconds });
};

const formatRecordToDisplay = record => ({
  id: +record.id,
  date: moment(+record.date).valueOf(),
  distance: record.distance,
  time: convertToMomentDate(record.time).format('HH:mm:ss'),
  averageSpeed: record.averageSpeed.toFixed(2)
});

const RECORDS_QUERY = gql`
  query Records($startDate: Long, $endDate: Long) {
    records(filter: { startDate: $startDate, endDate: $endDate }) {
      id
      date
      distance
      time
      averageSpeed
    }
  }
`;

@inject('modalStore', 'recordsStore')
@observer
export default class RecordsPage extends Component {
  static propTypes = {
    modalStore: PropTypes.object.isRequired,
    recordsStore: PropTypes.object.isRequired
  };

  state = {
    filters: {
      startDate: null,
      endDate: null
    }
  };

  componentWillMount() {
    this.recordsGridColumns = [
      {
        Header: 'Date',
        accessor: 'date',
        sortable: true,
        Cell: ({ value }) => moment(value).format('DD.MM.YYYY')
      },
      {
        Header: () => (
          <div>
            <div>Distance</div>
            <div>(Metres)</div>
          </div>
        ),
        accessor: 'distance',
        sortable: false
      },
      {
        Header: 'Time',
        accessor: 'time',
        sortable: false
      },
      {
        Header: () => (
          <div>
            <div>Average speed</div>
            <div>(Km/hr)</div>
          </div>
        ),
        width: 150,
        accessor: 'averageSpeed',
        sortable: false
      },
      {
        Header: 'Edit',
        Cell: cellInfo => {
          const { id } = cellInfo.original;
          const onEditClick = () => this.showEditRecordModal(id);
          cellInfo.onEditClick = cellInfo.onEditClick || onEditClick;
          return (
            <button
              type="button"
              className="btn btn-default fa fa-pencil"
              onClick={cellInfo.onEditClick}
            />
          );
        },
        width: 60,
        resizable: false,
        sortable: false
      },
      {
        Header: 'Delete',
        Cell: cellInfo => {
          const { id } = cellInfo.original;
          const onDeleteClick = () => this.showRemoveRecordModal(id);
          cellInfo.onDeleteClick = cellInfo.onDeleteClick || onDeleteClick;
          return (
            <button
              type="button"
              className="btn btn-default fa fa-trash-o"
              onClick={cellInfo.onDeleteClick}
            />
          );
        },
        width: 60,
        resizable: false,
        sortable: false
      }
    ];
  }

  componentDidMount() {
    this.props.recordsStore.init({ showLoading: true });
  }

  showAddRecordModal = () => {
    this.props.modalStore.showCustom({
      title: 'Add new record',
      component: <EditRecordModal isAddMode={true} />
    });
  };

  showEditRecordModal = recordId => {
    const relatedRecord = this.props.recordsStore.getRecordById(recordId);
    this.props.modalStore.showCustom({
      title: 'Edit record',
      component: <EditRecordModal record={relatedRecord} />
    });
  };

  showRemoveRecordModal = recordId => {
    const record = this.props.recordsStore.getFormattedRecordById(recordId);
    this.props.modalStore
      .showConfirm({
        title: 'Confirm your action',
        body: (
          <div>
            <div>Are you sure you want to delete this record?</div>
            <div>
              {`Date: ${moment(record.date).format('DD.MM.YYYY')};
              Distance: ${record.distance};
              Time: ${record.time};
              Average speed: ${record.averageSpeed}.`}
            </div>
          </div>
        )
      })
      .then(result => {
        if (!result) return;

        this.props.recordsStore.removeRecord(recordId, { showLoading: true });
      });
  };

  filterRecords = ({ startDate, endDate }) => {
    this.setState({
      filters: {
        startDate: startDate && startDate.startOf('day').valueOf(),
        endDate: endDate && endDate.startOf('day').valueOf()
      }
    });
  };

  renderRecordsGrid() {
    const { filters } = this.state;
    const hasFilters = !!(filters.startDate || filters.endDate);

    return (
      <Query query={RECORDS_QUERY} variables={filters}>
        {({ loading, data: { records } }) => {
          if (loading) {
            return <div>Loading...</div>;
          }

          records = records || [];

          const noRecords = records.length === 0;

          if (noRecords) {
            if (hasFilters) {
              return (
                <div className="no-records-placeholder">
                  <p>There are no records in selected date range...</p>
                </div>
              );
            }

            return (
              <div className="no-records-placeholder">
                <p>Your records list is empty...</p>
                <p>Feel free to create new record!</p>
              </div>
            );
          }

          const recordsGridData = records.map(formatRecordToDisplay);

          return (
            <ReactTable
              className={'records-table'}
              data={recordsGridData}
              columns={this.recordsGridColumns}
              pageSize={recordsGridData.length}
              showPageSizeOptions={false}
              showPagination={false}
            />
          );
        }}
      </Query>
    );
  }

  render() {
    const {
      recordsGridData,
      noRecords,
      noFilteredRecords
    } = this.props.recordsStore;

    return (
      <div className="page records-page">
        <Helmet title="Records" />
        <h1>Records</h1>
        <DateRangeFilter onDatesChange={this.filterRecords} />
        {this.renderRecordsGrid()}

        <div className="buttons-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.showAddRecordModal}
          >
            <i className="fa fa-plus" />
            Add new record
          </button>
        </div>
      </div>
    );
  }
}
