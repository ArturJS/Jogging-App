import _ from 'lodash';
import {Validators} from '../index';

export default {
  float,
  name,
  nameOnlyLetters,
  onlySymbolsByRegex,
  numberWithLength,
  positiveNumberWithLength,
  sentenceCaseTransform
};

function float(nextValue, prevValue) {
  let floatRegex = /^((\d{0,10})|((\d{1,10})\.?(\d{0,10})))$/;
  let value = nextValue;
  if (!floatRegex.test(value)) {
    value = prevValue;
  }
  return value;
}

function name() {
  return (nextValue, prevValue) => {
    if (Validators.name('')(nextValue) !== null) {
      return prevValue;
    }
    return nextValue;
  };
}

function nameOnlyLetters() {
  return (nextValue, prevValue) => {
    if (Validators.nameOnlyLetters('')(nextValue) !== null) {
      return prevValue;
    }
    return nextValue;
  };
}

function onlySymbolsByRegex(regex) {
  return (nextValue, prevValue) => {
    if (!regex.test(nextValue)) {
      return prevValue;
    }
    return nextValue;
  };
}

function numberWithLength(value) {
  return (nextValue, prevValue) => {
    if (!/^\d*$/.test(nextValue) || Validators.maxLength(value, '')(nextValue) !== null) {
      return prevValue;
    }
    return nextValue;
  };
}

function positiveNumberWithLength(value) {
  return (nextValue, prevValue) => {
    if (!/^\d*$/.test(nextValue) || Validators.maxLength(value, '')(nextValue) !== null || _.startsWith(nextValue, '0') || nextValue === '-') {
      return prevValue;
    }
    return nextValue;
  };
}

function sentenceCaseTransform(ctrl) {
  let values = ctrl.value.split(' ');
  ctrl.value = values.map(item => item[0] && (item[0].toUpperCase() + item.substr(1).toLowerCase())).join(' ');
}
