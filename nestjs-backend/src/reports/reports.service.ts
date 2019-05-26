import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { differenceInCalendarDays, getISOWeek } from 'date-fns';
import { RecordsService } from '../records/records.service';
import { Report } from '../graphql.schema';

const mapRecordsToReports = recordsList => {
  if (recordsList.length === 0) {
    return [];
  }

  const sortedByDateRecords = _.sortBy(recordsList, 'date');
  const firstRecord = sortedByDateRecords[0];

  firstRecord.week = 1;

  const firstRecordDate = new Date(+firstRecord.date);

  for (let i = 1; i < sortedByDateRecords.length; i += 1) {
    const recordDate = new Date(+sortedByDateRecords[i].date);
    const diffInWeeks = Math.ceil(
      differenceInCalendarDays(recordDate, firstRecordDate) / 7,
    );
    const oneLessWeek = +(
      diffInWeeks === 1 &&
      getISOWeek(recordDate) === getISOWeek(firstRecordDate)
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
      averageSpeed,
    };
  });

  return reportsList;
};

@Injectable()
export class ReportsService {
  constructor(private readonly recordsService: RecordsService) {}

  async getReports(): Promise<Report[]> {
    const records = await this.recordsService.getRecords();

    return mapRecordsToReports(records);
  }
}
