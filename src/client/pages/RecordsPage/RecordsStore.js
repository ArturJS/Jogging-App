import {
  observable,
  computed
} from 'mobx';
import {recordsApi} from '../../common/api/recordsApi';

class RecordsStore {
  @observable recordsList = [];

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

  @computed get recordsGridData() {
    return this.recordsList.map(record => ({
      id: record.id,
      date: record.date.format('DD.MM.YYYY'),
      distance: record.distance,
      time: record.time.format('HH:mm:ss'),
      averageSpeed: record.averageSpeed
    }));
  }
}

export default new RecordsStore();
