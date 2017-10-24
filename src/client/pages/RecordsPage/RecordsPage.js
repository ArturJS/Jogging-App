import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {inject, observer} from 'mobx-react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

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

  state = {
    recordsGrid: {}
  };

  componentWillMount() {
    this.setState({
      recordsGrid: {
        data: [
          {
            date: '123',
            distance: '12',
            time: '123',
            averageSpeed: '12'
          },
          {
            date: '234',
            distance: '12',
            time: '123',
            averageSpeed: '12'
          },
          {
            date: '345',
            distance: '12',
            time: '123',
            averageSpeed: '12'
          }
        ],
        columns: [
          {
            Header: 'Date',
            accessor: 'date',
            sortable: true
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
        ]
      }
    });
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
              `Date: ${record.date};
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
    console.log(startDate); // todo reset time for correct filtering
    console.log(endDate);
    this.setState({
      dateRangeFilter: {
        startDate,
        endDate
      }
    });
  };

  render() {
    const {
      recordsGrid
    } = this.state;
    const {recordsGridData} = this.props.recordsStore;

    return (
      <div className="page records-page">
        <Helmet title="Records"/>
        <h1>Records</h1>
        <DateRangeFilter onDatesChange={this.onDatesChange}/>

        {recordsGridData.length === 0 &&
        <div className="no-records-placeholder">
          <p>Your records list is empty...</p>
          <p>Feel free to create new record!</p>
        </div>
        }

        {recordsGridData.length > 0 &&
        <ReactTable
          className={'records-table'}
          data={recordsGridData}
          columns={recordsGrid.columns}
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
