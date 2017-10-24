import moment from 'moment';

import baseApi from './baseApi';


export const recordsApi = {
  createRecord({
    date, distance, time
  }) {
    return baseApi.ajax({
      method: 'post',
      url: '/records',
      data: _mapPostRecord({date, distance, time})
    })
      .then(res => res.data)
      .then(_mapGetRecord);
  },

  updateRecord({
    id, date, distance, time
  }) {
    return baseApi.ajax({
      method: 'put',
      url: `/records/${id}`,
      data: _mapPostRecord({date, distance, time})
    })
      .then(res => res.data)
      .then(_mapGetRecord);
  },

  removeRecord(id) {
    return baseApi.ajax({
      method: 'delete',
      url: `/records/${id}`
    })
      .then(res => res.data);
  },

  getAllRecords() {
    return baseApi.ajax({
      method: 'get',
      url: '/records'
    })
      .then(res => res.data)
      .then(data => data.map(_mapGetRecord));
  }
};

function _mapGetRecord(record) {
  return {
    id: record.id,
    date: moment(record.date),
    distance: record.distance,
    time: _convertToMomentDate(record.time),
    averageSpeed: record.averageSpeed.toFixed(2)
  };
}

function _mapPostRecord({date, distance, time}) {
  return {
    date: date.valueOf(),
    distance: +distance,
    time: _getSecondsFromMidNight(time)
  };
}

function _getSecondsFromMidNight(date) {
  const dateMidnight = date.clone().startOf('day');
  return date.diff(dateMidnight, 'seconds');
}

function _convertToMomentDate(timeInSeconds) {
  const HOUR = 3600;
  const MINUTE = 60;

  const hours = Math.floor(timeInSeconds / HOUR);
  const minutes = Math.floor((timeInSeconds - hours * HOUR) / MINUTE);
  const seconds = timeInSeconds - hours * HOUR - minutes * MINUTE;

  return moment({hours, minutes, seconds});
}
