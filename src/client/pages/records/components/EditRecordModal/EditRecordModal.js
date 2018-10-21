import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { graphql, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as yup from 'yup';
import { REPORTS_QUERY } from '../../../reports';
import { modalManager } from '../../../../common/features/ModalDialog';
import { RECORD_QUERY } from '../../../../common/graphql/queries';
import processErrors from '../../../../common/components/ProcessErrors';
import ErrorSummary from '../../../../common/components/ErrorSummary';
import { Form, Field } from '../../../../common/features/forms';
import { mapRecordToEdit } from '../../utils/mappers';
import './EditRecordModal.scss';

const getSecondsFromMidNight = date => {
  const dateMidnight = date.clone().startOf('day');
  return date.diff(dateMidnight, 'seconds');
};

const mapRecord = ({ date, distance, time }) => ({
  date: date.startOf('day').valueOf(),
  distance: +distance,
  time: getSecondsFromMidNight(time)
});

@graphql(
  gql`
    mutation($date: Long!, $distance: Float!, $time: Int!) {
      addRecord(record: { date: $date, distance: $distance, time: $time }) {
        id
      }
    }
  `,
  {
    name: 'addRecord'
  }
)
@graphql(
  gql`
    mutation($id: ID!, $date: Long!, $distance: Float!, $time: Int!) {
      updateRecord(
        id: $id
        record: { date: $date, distance: $distance, time: $time }
      ) {
        id
      }
    }
  `,
  {
    name: 'updateRecord'
  }
)
@withApollo
@processErrors
export default class EditRecordModal extends Component {
  static propTypes = {
    updateRecord: PropTypes.func.isRequired,
    addRecord: PropTypes.func.isRequired,
    recordId: PropTypes.number,
    isAddMode: PropTypes.bool,
    error: PropTypes.string,
    processAjaxError: PropTypes.func.isRequired
  };

  state = {
    formData: {
      date: moment().startOf('day'),
      distance: 0,
      time: moment().startOf('day')
    }
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
    const { recordId } = this.props;

    if (!recordId) {
      return;
    }

    const {
      data: { record: rawRecord }
    } = await this.props.client.query({
      query: RECORD_QUERY,
      variables: { id: recordId }
    });

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
    const refetchQueries = [
      {
        query: REPORTS_QUERY,
        variables: {
          awaitRefetchQueries: true
        }
      }
    ];

    try {
      if (isAddMode) {
        await this.props.addRecord({
          variables: recordPayload,
          refetchQueries
        });
      } else {
        await this.props.updateRecord({
          variables: {
            id: recordId,
            ...recordPayload
          },
          refetchQueries
        });
      }

      modalManager.close({ success: true });
    } catch (err) {
      this.props.processAjaxError(err);
    }
  };

  render() {
    const { error } = this.props;
    const { formData } = this.state;

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
