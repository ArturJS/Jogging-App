import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';

import {Form, FormStore, Controls, Validators, Field} from '../../../../common/features/Form';
import './EditRecordModal.scss';


@inject('modalStore')
export default class EditRecordModal extends Component {
  static propTypes = {
    modalStore: PropTypes.object.isRequired,
    addMode: PropTypes.bool
  };

  state = {
    error: null
  };

  componentWillMount() {
    this.formStore = new FormStore({
      date: {
        value: '',
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
        value: '',
        validators: [
          Validators.required('Please enter time')
        ]
      }
    });
  }

  submit = () => {
    if (!this.formStore.validate().valid) {
      this.formStore.setFocusFirstInvalid();
      return;
    }

    // const {
    //   date,
    //   distance,
    //   time
    // } = this.formStore.values;
  };

  render() {
    const {inputTextCtrl} = Controls;
    // const {error} = this.state;

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
            control={inputTextCtrl}/>
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
            control={inputTextCtrl}/>
        </div>
        <div className="buttons-group">
          <button className="btn btn-primary modal-button pull-right">
            Submit
          </button>
        </div>
      </Form>
    );
  }
}
