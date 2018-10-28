import moment from 'moment';
import _ from 'lodash';
import { isAuthenticatedResolver } from '../acl';
import db from '../../models/index';

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

export const reports = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const recordsList = await db.Record.findAll({
            where: {
                userId: context.userId
            }
        });
        const reportsList = mapRecordsToReports(recordsList);

        return reportsList;
    }
);
