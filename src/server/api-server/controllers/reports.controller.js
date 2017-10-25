import moment from 'moment';
import _ from 'lodash';

import db from '../models';

export const reportsController = {
  getAllReports: async(req, res) => {
    const recordsList = await db.Record.findAll({where: {email: req.user.email}});
    const reportsList = _mapRecordsToReports(recordsList);
    res.json(reportsList);
  }
};

// private methods

function _mapRecordsToReports(recordsList) {
  let groupedByWeekRecords = _.groupBy(recordsList, (record) => {
    return moment(record.date).week();
  });
  const minWeek = _.min(Object.keys(groupedByWeekRecords));
  groupedByWeekRecords = _.mapKeys(groupedByWeekRecords, (value, key) => key - minWeek + 1);

  return _.map(groupedByWeekRecords, (records, key) => {
    const averageDistance = _.sumBy(records, 'distance') / records.length;
    const averageSpeed = _.sumBy(records, 'averageSpeed') / records.length;

    return {
      week: key,
      averageDistance,
      averageSpeed
    };
  });
}
