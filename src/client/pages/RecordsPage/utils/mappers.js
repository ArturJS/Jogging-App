import moment from 'moment';

const convertToMomentDate = timeInSeconds => {
  const HOUR = 3600;
  const MINUTE = 60;

  const hours = Math.floor(timeInSeconds / HOUR);
  const minutes = Math.floor((timeInSeconds - hours * HOUR) / MINUTE);
  const seconds = timeInSeconds - hours * HOUR - minutes * MINUTE;

  return moment({ hours, minutes, seconds });
};

export const mapRecordToEdit = record => ({
  id: +record.id,
  date: moment(+record.date),
  distance: record.distance,
  time: convertToMomentDate(record.time)
});

export const mapRecordToDisplay = record => ({
  id: +record.id,
  date: moment(+record.date).valueOf(),
  distance: record.distance,
  time: convertToMomentDate(record.time).format('HH:mm:ss'),
  averageSpeed: record.averageSpeed.toFixed(2)
});
