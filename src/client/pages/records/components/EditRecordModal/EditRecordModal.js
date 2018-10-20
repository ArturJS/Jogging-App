import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { graphql, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { REPORTS_QUERY } from '../../../reports';
import { modalManager } from '../../../../common/features/ModalDialog';
import { RECORD_QUERY } from '../../../../common/graphql/queries';
import processErrors from '../../../../common/components/ProcessErrors';
import ErrorSummary from '../../../../common/components/ErrorSummary';
import {
  Form,
  FormStore,
  Controls,
  Validators,
  Field,
  Transformers
} from '../../../../common/features/Form';
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

  componentWillMount() {
    this.formStore = new FormStore({
      date: {
        value: moment().startOf('day'),
        validators: [Validators.required('Please select date of record')]
      },
      distance: {
        value: '',
        transform: Transformers.positiveNumberWithLength(10),
        validators: [Validators.required('Please enter distance')]
      },
      time: {
        value: moment().startOf('day'),
        validators: [
          Validators.required('Please enter time'),
          value => {
            if (!value || value.format('HH:mm:ss') === '00:00:00') {
              return 'Time should be more than "00:00:00"';
            }
          }
        ]
      }
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
      this.formStore.setFormData(record);
    }
  }

  submit = async () => {
    if (!this.formStore.validate().valid) {
      this.formStore.setFocusFirstInvalid();
      return;
    }

    const { isAddMode, recordId } = this.props;
    const { date, distance, time } = this.formStore.values;
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
    const { inputTextCtrl, singleDatePickerCtrl, timePickerCtrl } = Controls;
    const { error } = this.props;

    return (
      <Form
        onSubmit={this.submit}
        store={this.formStore}
        className="edit-record-form"
      >
        <div className="form-group">
          <label htmlFor="date" className="control-label">
            Date
          </label>
          <Field
            className="control-field"
            name="date"
            control={singleDatePickerCtrl}
          />
        </div>
        <div className="form-group">
          <label htmlFor="distance" className="control-label">
            Distance
          </label>
          <Field
            className="control-field"
            name="distance"
            control={inputTextCtrl}
          />
        </div>
        <div className="form-group">
          <label htmlFor="time" className="control-label">
            Time
          </label>
          <Field
            className="control-field"
            name="time"
            control={timePickerCtrl}
          />
        </div>
        <ErrorSummary error={error} />
        <div className="buttons-group">
          <button className="btn btn-primary modal-button pull-right">
            Submit
          </button>
        </div>
      </Form>
    );
  }
}