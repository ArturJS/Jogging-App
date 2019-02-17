// @flow
import moment from 'moment';
import type Moment from 'moment';

const convertToMomentDate = (timeInSeconds: number): Moment => {
    const HOUR = 3600;
    const MINUTE = 60;

    const hours = Math.floor(timeInSeconds / HOUR);
    const minutes = Math.floor((timeInSeconds - hours * HOUR) / MINUTE);
    const seconds = timeInSeconds - hours * HOUR - minutes * MINUTE;

    return moment({ hours, minutes, seconds });
};

export const mapRecordToEdit = (record: {|
    id: string,
    date: Date,
    distance: number,
    time: number
|}): {|
    id: number,
    date: Moment,
    distance: number,
    time: Moment
|} => ({
    id: +record.id,
    date: moment(+record.date),
    distance: record.distance,
    time: convertToMomentDate(record.time)
});

export const mapRecordToDisplay = (record: {|
    id: number,
    date: Date,
    distance: number,
    time: number,
    averageSpeed: number
|}): {|
    id: number,
    date: number,
    distance: number,
    time: string,
    averageSpeed: string
|} => ({
    id: +record.id,
    date: moment(+record.date).valueOf(),
    distance: record.distance,
    time: convertToMomentDate(record.time).format('HH:mm:ss'),
    averageSpeed: record.averageSpeed.toFixed(2)
});
