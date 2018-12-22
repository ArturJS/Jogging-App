// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import ReactTable from 'react-table';
import { compose, withProps, withStateHandlers, withHandlers } from 'recompose';
import moment from 'moment';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { REPORTS_QUERY } from '../reports';
import withGraphql from '../../common/graphql/with-graphql';
import { withPreloadRoutes, withRefs } from '../../common/hocs';
import modal from '../../common/features/modal';
import { RECORD_QUERY } from '../../common/graphql/queries';
import { mapRecordToDisplay } from './utils/mappers';
import EditRecordModal from './components/edit-record-modal';
import DateRangeFilter from './components/date-range-filter';
import './records.scss';

const RECORDS_QUERY = gql`
    query($startDate: Long, $endDate: Long) {
        records(filter: { startDate: $startDate, endDate: $endDate }) {
            id
            date
            distance
            time
            averageSpeed
        }
    }
`;

const enhance = compose(
    withGraphql({
        gql: RECORD_QUERY,
        name: 'getRecordById',
        mapResponseData: ({ record }) => mapRecordToDisplay(record)
    }),
    withGraphql({
        gql: gql`
            mutation($id: ID!) {
                deleteRecord(id: $id)
            }
        `,
        name: 'removeRecord',
        refetchQueries: [
            {
                query: REPORTS_QUERY,
                variables: {
                    awaitRefetchQueries: true
                }
            }
        ]
    }),
    withPreloadRoutes({
        routes: ['sign-up', 'reports']
    }),
    withRefs,
    withHandlers({
        showAddRecordModal: ({ getRef }) => () => {
            modal
                .custom({
                    title: 'Add new record',
                    // eslint-disable-next-line react/prop-types
                    body: ({ closeModal }) => (
                        <EditRecordModal isAddMode closeModal={closeModal} />
                    )
                })
                .result.then(() => {
                    getRef('refetchRecords')();
                });
        },
        showEditRecordModal: ({ getRef }) => recordId => {
            modal
                .custom({
                    title: 'Edit record',
                    // eslint-disable-next-line react/prop-types
                    body: ({ closeModal }) => (
                        <EditRecordModal
                            recordId={recordId}
                            closeModal={closeModal}
                        />
                    )
                })
                .result.then(() => {
                    getRef('refetchRecords')();
                });
        },
        showRemoveRecordModal: ({
            getRef,
            removeRecord,
            getRecordById
        }) => async recordId => {
            const record = await getRecordById({ id: recordId });

            modal
                .confirm({
                    title: 'Confirm your action',
                    body: () => (
                        <div>
                            <div>
                                Are you sure you want to delete this record?
                            </div>
                            <div>
                                {`Date: ${moment(record.date).format(
                                    'DD.MM.YYYY'
                                )};
                                Distance: ${record.distance};
                                Time: ${record.time};
                                Average speed: ${record.averageSpeed}.`}
                            </div>
                        </div>
                    )
                })
                .result.then(async () => {
                    await removeRecord({
                        id: recordId
                    });

                    getRef('refetchRecords')();
                });
        }
    }),
    withProps(({ showEditRecordModal, showRemoveRecordModal }) => ({
        recordsGridColumns: [
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
                    const onEditClick = () => showEditRecordModal(id);

                    // eslint-disable-next-line no-param-reassign
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
                    const onDeleteClick = () => showRemoveRecordModal(id);

                    // eslint-disable-next-line no-param-reassign
                    cellInfo.onDeleteClick =
                        cellInfo.onDeleteClick || onDeleteClick;

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
        ]
    })),
    withStateHandlers(
        {
            filters: {
                startDate: null,
                endDate: null
            }
        },
        {
            filterRecords: () => ({ startDate, endDate }) => ({
                filters: {
                    startDate: startDate && startDate.startOf('day').valueOf(),
                    endDate: endDate && endDate.startOf('day').valueOf()
                }
            })
        }
    ),
    withHandlers({
        renderRecordsGrid: ({ filters, recordsGridColumns, setRef }) => () => {
            const hasFilters = !!(filters.startDate || filters.endDate);

            return (
                <Query query={RECORDS_QUERY} variables={filters}>
                    {({ loading, refetch, data }) => {
                        if (loading) {
                            return <div>Loading...</div>;
                        }

                        setRef('refetchRecords', refetch);

                        // eslint-disable-next-line no-param-reassign
                        const records = (data && data.records) || [];

                        const noRecords = records.length === 0;

                        if (noRecords) {
                            if (hasFilters) {
                                return (
                                    <div className="no-records-placeholder">
                                        <p>
                                            There are no records in selected
                                            date range...
                                        </p>
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

                        const recordsGridData = records.map(mapRecordToDisplay);

                        return (
                            <ReactTable
                                className="records-table"
                                data={recordsGridData}
                                columns={recordsGridColumns}
                                pageSize={recordsGridData.length}
                                showPageSizeOptions={false}
                                showPagination={false}
                            />
                        );
                    }}
                </Query>
            );
        }
    })
);

const Records = ({ filterRecords, renderRecordsGrid, showAddRecordModal }) => (
    <div className="page records-page">
        <Helmet title="Records" />
        <h1>Records</h1>

        <DateRangeFilter onDatesChange={filterRecords} />

        {renderRecordsGrid()}

        <div className="buttons-group">
            <button
                type="button"
                className="btn btn-primary btn-add-record"
                onClick={showAddRecordModal}
            >
                <i className="fa fa-plus" />
                Add new record
            </button>
        </div>
    </div>
);

Records.propTypes = {
    filterRecords: PropTypes.func.isRequired,
    renderRecordsGrid: PropTypes.func.isRequired,
    showAddRecordModal: PropTypes.func.isRequired
};

export default enhance(Records);
