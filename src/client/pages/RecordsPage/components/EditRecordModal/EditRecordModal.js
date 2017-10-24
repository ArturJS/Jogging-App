import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import moment from 'moment';

import {Form, FormStore, Controls, Validators, Field} from '../../../../common/features/Form';
import './EditRecordModal.scss';


@inject('modalStore', 'recordsStore')
export default class EditRecordModal extends Component {
  static propTypes = {
    modalStore: PropTypes.object.isRequired,
    record: PropTypes.object,
    isAddMode: PropTypes.bool
  };

  state = {
    error: null
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
        validators: [
          Validators.required('Please enter distance')
        ]
      },
      time: {
        value: moment().startOf('day'),
        validators: [
          Validators.required('Please enter time')
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

    // try {
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
    // }
    // catch (err) {
    //   this.processAjaxError(err);
    // }
  };

  processAjaxError(err) {
    const {error} = err.response.data;
    this.setState({error});
  }

  render() {
    const {
      inputTextCtrl,
      singleDatePickerCtrl,
      timePickerCtrl
    } = Controls;
    const {error} = this.state;

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
        {error &&
        <div className="field-error-text">
          {error}
        </div>
        }
        <div className="buttons-group">
          <button className="btn btn-primary modal-button pull-right">
            Submit
          </button>
        </div>
      </Form>
    );
  }
}
