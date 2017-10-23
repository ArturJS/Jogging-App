import {observable, action, toJS} from 'mobx';
import _ from 'lodash';
import {retryAsync} from '../../helpers/common-helpers';

export default class FormStore {
  @observable _ctrls = observable.map({});

  constructor(controls, onChangedMixins, onBluredMixins) {
    let ctrls = {...controls};
    ctrls = this.initializeControls(ctrls, onChangedMixins, onBluredMixins);
    this._ctrls = observable.map(ctrls);
  }

  initializeControls = (ctrls, onChangedMixins, onBluredMixins) => {
    let newCtrls = {};
    _.forOwn(ctrls, (ctrl, name) => {
      ctrl.error = null;
      ctrl.name = name;
      ctrl.validators = ctrl.validators || [];
      ctrl.asyncValidators = ctrl.asyncValidators || [];
      ctrl.transform = ctrl.transform || (v => v);
      ctrl.onFocusTransform = ctrl.onFocusTransform || (v => v);
      ctrl.onBlurTransform = ctrl.onBlurTransform || (v => v);
      ctrl.disabled = ctrl.disabled || false;
      ctrl.onEnter = ctrl.onEnter || _.noop;
      ctrl.isDifirenceExist = false;
      let onChanged = ctrl.onChanged || _.noop;
      if (onChangedMixins) {
        ctrl.onChanged = (control, controls, formStore) => {
          if (typeof onChangedMixins === 'function') {
            onChangedMixins(control, controls, formStore);
          }
          else if (Array.isArray(onChangedMixins)) {
            for (let mixin of onChangedMixins) {
              mixin(control, controls, formStore);
            }
          }
          onChanged(control, controls, formStore);
        };
      }
      else {
        ctrl.onChanged = onChanged;
      }
      let onBlured = ctrl.onBlured || _.noop;
      if (onBluredMixins) {
        ctrl.onBlured = (control, controls) => {
          if (typeof onBluredMixins === 'function') {
            onBluredMixins(control, controls);
          }
          else if (Array.isArray(onBluredMixins)) {
            for (let mixin of onBluredMixins) {
              mixin(control, controls);
            }
          }
          onBlured(control, controls);
        };
      }
      else {
        ctrl.onBlured = onBlured;
      }

      newCtrls[name] = ctrl;
    });
    return newCtrls;
  };

  @action
  validate() {
    let errors = {};
    this._ctrls.forEach((ctrl) => {
      let error = this.validateCtrl(ctrl);
      ctrl.touched = true;
      ctrl.error = error;
      if (error) {
        errors[ctrl.name] = error;
      }
    });
    return {
      valid: _.isEmpty(errors),
      errors
    };
  }

  @action
  validateTouchedCtrls() {
    this._ctrls.forEach((ctrl) => {
      if (ctrl.touched) {
        ctrl.error = this.validateCtrl(ctrl);
      }
    });
  }

  @action
  validateCtrl(ctrl) {
    if (!_.isObject(ctrl) || !ctrl.hasOwnProperty('validators')) return null;
    let values = this.values;
    for (let validator of ctrl.validators) {
      let error = validator(ctrl.value, values, ctrl, this._ctrls);
      if (error) {
        return error;
      }
    }
    return null;
  }

  @action
  asyncValidateCtrl(name) {
    let ctrl = this.getCtrl(name);

    if (!ctrl.error) {
      let values = this.values;
      let promises = [];

      if (ctrl.options) {
        ctrl.options.isAsyncValidatingInProgress = true;
      }

      for (let validator of ctrl.asyncValidators) {
        promises.push(validator(ctrl.value, values, ctrl));
      }

      return Promise
        .all(promises)
        .then(
          () => this._asyncValidatingDone(null, ctrl),
          error => this._asyncValidatingDone(error, ctrl)
        );
    }
  }

  @action
  mergeConfiguration(configuration) {
    this.ctrls.forEach((ctrl, name) => {
      ctrl.error = null;
      if (configuration[name]) {
        ctrl.validators = configuration[name].validators || ctrl.validators;
        ctrl.options = {...ctrl.options, ...configuration[name].options, hide: configuration[name].hide};
        if (configuration[name].value === '' && !ctrl.readonly) {
          ctrl.value = '';
        }
      }
    });
  }

  getCtrl(name) {
    return this._ctrls.get(name);
  }


  setFocus(fullName) {
    const ctrl = this.getCtrl(fullName);
    return retryAsync(() => {
      if (!ctrl || !ctrl.ref) return false;
      ctrl.ref.focus();
      return true;
    }).result;
  }

  setFocusFirstEmpty() {
    for (let [name, ctrl] of this._ctrls) {
      if (_.isEmpty(ctrl.value)) {
        this.setFocus(name);
        return true;
      }
    }
    return false;
  }

  setFocusFirstInvalid() {
    for (let [name, ctrl] of this._ctrls) {
      if (ctrl.error) {
        this.setFocus(name);
        return true;
      }
    }
    return false;
  }

  resetFormData() {
    for (let [, ctrl] of this._ctrls) {
      ctrl.value = '';
    }
  }

  _asyncValidatingDone(error, ctrl) {
    ctrl.error = error;
    ctrl.options.isAsyncValidatingInProgress = false;
  }

  get ctrls() {
    return this._ctrls;
  }

  get ctrlsData() {
    return _.mapValues(this._ctrls._data, ctrl => ctrl.value);
  }

  get values() {
    return _.mapValues(toJS(this._ctrls), ctrl => ctrl.value);
  }

  get nonHiddenValues() {
    return _.mapValues(toJS(this._ctrls), ctrl => {
      if (!ctrl.options || !ctrl.options.hide) {
        return ctrl.value;
      }
    });
  }

  disableAll() {
    this._ctrls.forEach(ctrl => {
      ctrl.disabled = true;
    });
  }
}
