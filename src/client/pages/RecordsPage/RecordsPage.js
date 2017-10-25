import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {inject, observer} from 'mobx-react';
import ReactTable from 'react-table';
import moment from 'moment';

import EditRecordModal from './components/EditRecordModal';
import DateRangeFilter from './components/DateRangeFilter';
import './RecordsPage.scss';

@inject('userStore', 'modalStore', 'recordsStore')
@observer
export default class RecordsPage extends Component {
  static propTypes = {
    userStore: PropTypes.object.isRequired,
    modalStore: PropTypes.object.isRequired,
    recordsStore: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.recordsGridColumns = [
      {
        Header: 'Date',
        accessor: 'date',
        sortable: true,
        Cell: ({value}) => moment(value).format('DD.MM.YYYY')
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
        Cell: (cellInfo) => {
          const {id} = cellInfo.original;
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
        Cell: (cellInfo) => {
          const {id} = cellInfo.original;
          const onDeleteClick = () => this.showRemoveRecordModal(id);
          cellInfo.onDeleteClick = cellInfo.onDeleteClick || onDeleteClick;
          return (
            <button
              type="button"
              className="btn btn-default fa fa-trash-o"
              onClick={cellInfo.onDeleteClick}/>
          );
        },
        width: 60,
        resizable: false,
        sortable: false
      }
    ];
  }

  componentDidMount() {
    this.props.recordsStore.init();
  }

  showAddRecordModal = () => {
    this.props.modalStore.showCustom({
      title: 'Add new record',
      component: <EditRecordModal isAddMode={true}/>
    });
  };

  showEditRecordModal = (recordId) => {
    const relatedRecord = this.props.recordsStore.getRecordById(recordId);
    this.props.modalStore.showCustom({
      title: 'Edit record',
      component: <EditRecordModal record={relatedRecord}/>
    });
  };

  showRemoveRecordModal = (recordId) => {
    const record = this.props.recordsStore.getFormattedRecordById(recordId);
    this.props.modalStore.showConfirm({
      title: 'Confirm your action',
      body: (
        <div>
          <div>Are you sure you want to delete this record?</div>
          <div>
            {
              `Date: ${moment(record.date).format('DD.MM.YYYY')};
              Distance: ${record.distance};
              Time: ${record.time};
              Average speed: ${record.averageSpeed}.`
            }
          </div>
        </div>
      )
    }).then((result) => {
      if (!result) return;

      this.props.recordsStore.removeRecord(recordId);
    });
  };

  onDatesChange = ({startDate, endDate}) => {
    this.props.recordsStore.setFilter({
      startDate: startDate && startDate.startOf('day'),
      endDate: endDate && endDate.startOf('day')
    });
  };

  render() {
    const {
      recordsGridData,
      noRecords,
      noFilteredRecords
    } = this.props.recordsStore;

    return (
      <div className="page records-page">
        <Helmet title="Records"/>
        <h1>Records</h1>
        <DateRangeFilter onDatesChange={this.onDatesChange}/>

        {noRecords &&
        <div className="no-records-placeholder">
          <p>Your records list is empty...</p>
          <p>Feel free to create new record!</p>
        </div>
        }

        {!noRecords && noFilteredRecords &&
        <div className="no-records-placeholder">
          <p>There are no records in selected date range...</p>
        </div>
        }

        {!noFilteredRecords &&
        <ReactTable
          className={'records-table'}
          data={recordsGridData}
          columns={this.recordsGridColumns}
          pageSize={recordsGridData.length}
          showPageSizeOptions={false}
          showPagination={false}/>
        }

        <div className="buttons-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.showAddRecordModal}>
            <i className="fa fa-plus"/>
            Add new record
          </button>
        </div>
      </div>
    );
  }
}
