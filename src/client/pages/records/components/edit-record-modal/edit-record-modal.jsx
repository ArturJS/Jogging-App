import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { gql } from 'apollo-boost';
import * as yup from 'yup';
import { REPORTS_QUERY } from '../../../reports';
import { RECORD_QUERY } from '../../../../common/graphql/queries';
import withGraphql from '../../../../common/graphql/with-graphql';
import ErrorSummary from '../../../../common/components/error-summary';
import { Form, Field } from '../../../../common/features/forms';
import { mapRecordToEdit } from '../../utils/mappers';
import './edit-record-modal.scss';

const getSecondsFromMidNight = date => {
    const dateMidnight = date.clone().startOf('day');
    return date.diff(dateMidnight, 'seconds');
};

const mapRecord = ({ date, distance, time }) => ({
    date: date.startOf('day').valueOf(),
    distance: +distance,
    time: getSecondsFromMidNight(time)
});

const refetchQueries = [
    {
        query: REPORTS_QUERY,
        variables: {
            awaitRefetchQueries: true
        }
    }
];

@withGraphql({
    gql: gql`
        mutation($date: Long!, $distance: Float!, $time: Int!) {
            addRecord(
                record: { date: $date, distance: $distance, time: $time }
            ) {
                id
            }
        }
    `,
    name: 'addRecord',
    refetchQueries
})
@withGraphql({
    gql: gql`
        mutation($id: ID!, $date: Long!, $distance: Float!, $time: Int!) {
            updateRecord(
                id: $id
                record: { date: $date, distance: $distance, time: $time }
            ) {
                id
            }
        }
    `,
    name: 'updateRecord',
    refetchQueries
})
@withGraphql({
    gql: RECORD_QUERY,
    name: 'getRecordById'
})
class EditRecordModal extends Component {
    static propTypes = {
        updateRecord: PropTypes.func.isRequired,
        addRecord: PropTypes.func.isRequired,
        closeModal: PropTypes.func.isRequired,
        recordId: PropTypes.number,
        isAddMode: PropTypes.bool
    };

    static defaultProps = {
        recordId: null,
        isAddMode: false
    };

    state = {
        formData: {
            date: moment().startOf('day'),
            distance: 0,
            time: moment().startOf('day')
        },
        error: null
    };

    componentWillMount() {
        this.validationSchema = yup.object().shape({
            date: yup.mixed().required('Please select date of record'),
            distance: yup.number().required('Please enter distance'),
            time: yup
                .mixed()
                .test(
                    'is-positive-time',
                    'Time should be more than "00:00:00"',
                    value => value && value.format('HH:mm:ss') !== '00:00:00'
                )
                .required('Please enter time')
        });
    }

    async componentDidMount() {
        const { recordId, getRecordById } = this.props;

        if (!recordId) {
            return;
        }

        const { record: rawRecord } = await getRecordById({ id: recordId });

        const record = mapRecordToEdit(rawRecord);

        if (record) {
            this.setState({
                formData: {
                    date: record.date,
                    distance: record.distance,
                    time: record.time
                }
            });
        }
    }

    onSubmit = async values => {
        const { isAddMode, recordId } = this.props;
        const { date, distance, time } = values;
        const recordPayload = mapRecord({
            date,
            distance,
            time
        });

        try {
            if (isAddMode) {
                const { addRecord } = this.props;

                await addRecord(recordPayload);
            } else {
                const { updateRecord } = this.props;

                await updateRecord({
                    id: recordId,
                    ...recordPayload
                });
            }

            const { closeModal } = this.props;

            closeModal({ success: true });
        } catch (error) {
            this.setState({ error });
        }
    };

    render() {
        const { formData, error } = this.state;

        return (
            <Form
                className="edit-record-form"
                validationSchema={this.validationSchema}
                initialValues={formData}
                onSubmit={this.onSubmit}
            >
                <Field name="date" component="singleDatePicker" label="Date" />
                <Field name="distance" component="text" label="Distance" />
                <Field name="time" component="timePicker" label="Time" />
                <ErrorSummary error={error} />
                <div className="buttons-group">
                    <button
                        className="btn btn-primary modal-button pull-right"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </Form>
        );
    }
}

export default EditRecordModal;
