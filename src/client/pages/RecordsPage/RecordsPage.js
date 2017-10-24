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
            accessor: 'averageSpeed',
            sortable: false
          },
          {
            Header: 'Edit',
            Cell: () => {
              return (
                <button type="button" className="btn btn-default fa fa-pencil"/>
              );
            },
            width: 60,
            resizable: false,
            sortable: false
          },
          {
            Header: 'Delete',
            Cell: () => {
              return (
                <button type="button" className="btn btn-default fa fa-trash-o"/>
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

  onDatesChange = ({startDate, endDate}) => {
    console.log(startDate);
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
        <ReactTable
          className={'records-table'}
          data={recordsGridData}
          columns={recordsGrid.columns}
          pageSize={recordsGridData.length}
          showPageSizeOptions={false}
          showPagination={false}/>
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
