import moment from 'moment';
import _ from 'lodash';

const mapRecordsToReports = recordsList => {
    if (recordsList.length === 0) return [];

    const sortedByDateRecords = _.sortBy(recordsList, 'date');
    const firstRecord = sortedByDateRecords[0];

    firstRecord.week = 1;
    const firstRecordDate = moment(+firstRecord.date);

    for (let i = 1; i < sortedByDateRecords.length; i += 1) {
        const recordDate = moment(+sortedByDateRecords[i].date);
        const diffInWeeks = Math.ceil(
            recordDate.diff(firstRecordDate, 'days') / 7
        );
        const oneLessWeek = +(
            diffInWeeks === 1 && recordDate.week() === firstRecordDate.week()
        );

        sortedByDateRecords[i].week = diffInWeeks - oneLessWeek + 1;
    }

    const groupedByWeekRecords = _.groupBy(sortedByDateRecords, 'week');
    const reportsList = _.map(groupedByWeekRecords, (records, key) => {
        const averageDistance = _.sumBy(records, 'distance') / records.length;
        const averageSpeed = _.sumBy(records, 'averageSpeed') / records.length;
        return {
            week: key,
            averageDistance,
            averageSpeed
        };
    });

    return reportsList;
};

export class ReportsBLL {
    constructor(recordsBLL) {
        this._recordsBLL = recordsBLL;
    }

    async getReports({ userId }) {
        const records = await this._recordsBLL.getAllRecords({ userId });

        return mapRecordsToReports(records);
    }
}
