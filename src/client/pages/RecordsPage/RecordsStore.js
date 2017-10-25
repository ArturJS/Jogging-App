import {
  observable,
  action,
  computed,
  extendObservable
} from 'mobx';
import {recordsApi} from '../../common/api/recordsApi';

const MAX_DATE = 8640000000000000;
const MIN_DATE = -MAX_DATE;

class RecordsStore {
  @observable recordsList = [];
  @observable _filter = observable({
    startDate: null,
    endDate: null
  });

  async init() {
    const recordsList = await recordsApi.getAllRecords();
    this.recordsList.replace(recordsList);
  }

  async createRecord({date, distance, time}) {
    const newRecord = await recordsApi.createRecord({
      date,
      distance,
      time
    });

    this.recordsList.push(newRecord);
  }

  async updateRecord({id, date, distance, time}) {
    const updatedRecord = await recordsApi.updateRecord({
      id,
      date,
      distance,
      time
    });
    const relatedRecordIndex = this.recordsList.findIndex(record => record.id === id);

    if (relatedRecordIndex > -1) {
      this.recordsList[relatedRecordIndex] = updatedRecord;
    }
  }

  async removeRecord(id) {
    await recordsApi.removeRecord(id);
    this.recordsList.replace(
      this.recordsList.filter(record => record.id !== id)
    );
  }

  @action setFilter({startDate, endDate}) {
    extendObservable(this._filter, {startDate, endDate});
  }

  getRecordById(recordId) {
    return this.recordsList.find(record => record.id === recordId);
  }

  getFormattedRecordById(recordId) {
    return _formatRecordToDisplay(
      this.getRecordById(recordId)
    );
  }

  @computed get noRecords() {
    return this.recordsList.length === 0;
  }

  @computed get noFilteredRecords() {
    return this.recordsGridData.length === 0;
  }

  @computed get recordsGridData() {
    return this._getFilteredRecords().map(_formatRecordToDisplay);
  }

  _getFilteredRecords() {
    let {startDate, endDate} = this._filter;
    startDate = startDate || MIN_DATE;
    endDate = endDate || MAX_DATE;

    return this.recordsList.filter(record => {
      const date = record.date.valueOf();
      return date >= startDate && date <= endDate;
    });
  }
}

export default new RecordsStore();

function _formatRecordToDisplay(record) {
  return {
    id: record.id,
    date: record.date.valueOf(),
    distance: record.distance,
    time: record.time.format('HH:mm:ss'),
    averageSpeed: record.averageSpeed
  };
}
