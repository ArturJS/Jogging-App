import _ from 'lodash';

export default {
  required,
  minLength,
  regex,
  maxLength,
  rangeLength,
  minValue,
  number,
  float,
  bool,
  string,
  date,
  website,
  name,
  nameOnlyLetters,
  email,
  containsLetters
};

function required(error) {
  function _required(value) {
    if (_.isEmpty(value) || _.isString(value) && _.isEmpty(value.trim())) {
      return error;
    }
    return null;
  }

  _required.isRequiredFunction = true;

  return _required;
}

function minLength(length, error) {
  return (value) => {
    if (value.length < length && value.length > 0) {
      return error;
    }
    return null;
  };
}

function maxLength(length, error) {
  return (value) => {
    if (value.length > length && value.length > 0) {
      return error;
    }
    return null;
  };
}

function rangeLength(minLen, maxLen, error) {
  return (value) => {
    if ((value.length < minLen || value.length > maxLen) && value.length > 0) {
      return error;
    }
    return null;
  };
}

function minValue(minVal, error) {
  return (value) => {
    if (value < minVal) {
      return error;
    }
    return null;
  };
}

function number(error) {
  const numberRegexp = new RegExp(
    '^' +                // No leading content.
    '[-+]?' +            // Optional sign.
    '([0]|[1-9]' +       // No leading zeros.
    '([0-9]{0,30}))' +   // Maximum 31 digits
    '$'                  // No trailing content.
  );
  return regex(numberRegexp, error);
}

function float(error) {
  const numberRegexp = new RegExp(
    '^' +                // No leading content.
    '[-+]?' +            // Optional sign.
    '([0]|[1-9]' +       // No leading zeros.
    '([0-9]{0,30}))' +   // Maximum 31 digits
    '(.[0-9]{1,30})?' +   // Optional fraction
    '$'                  // No trailing content.
  );
  return regex(numberRegexp, error);
}


function bool(error) {
  return (value) => {
    if ((typeof value !== 'boolean' || value !== 'true' || value !== 'false') && value.length > 0) {
      return error;
    }
    return null;
  };
}


function string(error) {
  return (value) => {
    if (typeof value !== 'string') {
      return error;
    }
    return null;
  };
}

function date(error) {
  // eslint-disable-next-line max-len
  const numberRegexp = /^(((((((0?[13578])|(1[02]))[\.\-/]?((0?[1-9])|([12]\d)|(3[01])))|(((0?[469])|(11))[\.\-/]?((0?[1-9])|([12]\d)|(30)))|((0?2)[\.\-/]?((0?[1-9])|(1\d)|(2[0-8]))))[\.\-/]?(((19)|(20))?([\d][\d]))))|((0?2)[\.\-/]?(29)[\.\-/]?(((19)|(20))?(([02468][048])|([13579][26])))))$/;
  // Matches 02-29-2004 | 1/31/1997 | 1-2-03
  // Non-Matches 02-29-2003 | 04-31-2003 | 31-03-05
  return regex(numberRegexp, error);
}

function regex(reg, error) {
  return (value) => {
    if (!reg.test(value) && value.length > 0) {
      return error;
    }
    return null;
  };
}

function website(error) {
  const numberRegexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9]+([\-]{1}[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+([\-\.\/]{1}[a-zA-Z0-9]+)*$/;
  return regex(numberRegexp, error);
}

function name(error) {
  const numberRegexp = /^[a-zA-Z0-9&()]+([&., '/-]*[&a-zA-Z0-9()]*)*$/;
  return regex(numberRegexp, error);
}

function containsLetters(error) {
  const regexp = /[a-zA-Z]+/;
  return regex(regexp, error);
}

function nameOnlyLetters(error) {
  const regexp = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
  return regex(regexp, error);
}

function email(error) {
  return regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, error);
}
