import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import moment from 'moment';

import processErrors from '../../../../common/components/ProcessErrors';
import ErrorSummary from '../../../../common/components/ErrorSummary';
import {Form, FormStore, Controls, Validators, Field, Transformers} from '../../../../common/features/Form';
import './EditRecordModal.scss';


@inject('modalStore', 'recordsStore')
@processErrors
export default class EditRecordModal extends Component {
  static propTypes = {
    modalStore: PropTypes.object.isRequired,
    record: PropTypes.object,
    isAddMode: PropTypes.bool,
    error: PropTypes.string,
    processAjaxError: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.formStore = new FormStore({
      date: {
        value: moment().startOf('day'),
        validators: [
          Validators.required('Please select date of record')
        ]
      },
      distance: {
        value: '',
        transform: Transformers.positiveNumberWithLength(10),
        validators: [
          Validators.required('Please enter distance')
        ]
      },
      time: {
        value: moment().startOf('day'),
        validators: [
          Validators.required('Please enter time'),
          (value) => {
            if (!value || value.format('HH:mm:ss') === '00:00:00') {
              return 'Time should be more than "00:00:00"';
            }
          }
        ]
      }
    });

    const {record} = this.props;

    if (record) {
      this.formStore.setFormData(record);
    }
  }

  submit = async() => {
    if (!this.formStore.validate().valid) {
      this.formStore.setFocusFirstInvalid();
      return;
    }

    const {values} = this.formStore;
    const {isAddMode, recordsStore, record} = this.props;
    console.dir(values);

    const {
      date,
      distance,
      time
    } = this.formStore.values;

    try {
      if (isAddMode) {
        await recordsStore.createRecord({
          date,
          distance,
          time
        });
      }
      else {
        await recordsStore.updateRecord({
          id: record.id,
          date,
          distance,
          time
        });
      }

      this.props.modalStore.close();
    }
    catch (err) {
      this.props.processAjaxError(err);
    }
  };

  render() {
    const {
      inputTextCtrl,
      singleDatePickerCtrl,
      timePickerCtrl
    } = Controls;
    const {error} = this.props;

    return (
      <Form
        onSubmit={this.submit}
        store={this.formStore}
        className="edit-record-form">
        <div className="form-group">
          <label
            htmlFor="date"
            className="control-label">
            Date
          </label>
          <Field
            className="control-field"
            name="date"
            control={singleDatePickerCtrl}/>
        </div>
        <div className="form-group">
          <label
            htmlFor="distance"
            className="control-label">
            Distance
          </label>
          <Field
            className="control-field"
            name="distance"
            control={inputTextCtrl}/>
        </div>
        <div className="form-group">
          <label
            htmlFor="time"
            className="control-label">
            Time
          </label>
          <Field
            className="control-field"
            name="time"
            control={timePickerCtrl}/>
        </div>
        <ErrorSummary error={error}/>
        <div className="buttons-group">
          <button className="btn btn-primary modal-button pull-right">
            Submit
          </button>
        </div>
      </Form>
    );
  }
}
