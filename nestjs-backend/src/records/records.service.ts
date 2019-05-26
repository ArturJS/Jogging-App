import { Injectable } from '@nestjs/common';
import { Record, RecordInput } from '../graphql.schema';

@Injectable()
export class RecordsService {
  private records: Record[] = [];
  private nextId = 0;

  async getRecords(): Promise<Record[]> {
    return this.records;
  }

  async getRecordById(id: number): Promise<Record> {
    return this.records.find(record => record.id === id);
  }

  async createRecord(record: RecordInput): Promise<Record> {
    const createdRecord = {
      id: ++this.nextId,
      averageSpeed: record.distance / record.time,
      ...record,
    };

    this.records.push(createdRecord);

    return createdRecord;
  }

  async updateRecord(id: number, record: RecordInput): Promise<Record> {
    const recordToUpdate = this.records.find(item => item.id === id);

    if (!recordToUpdate) {
      return null;
    }

    Object.assign(recordToUpdate, record);

    return recordToUpdate;
  }

  async deleteRecord(id: number): Promise<boolean> {
    const oldLength = this.records.length;

    this.records = this.records.filter(record => record.id !== id);

    return oldLength !== this.records.length;
  }
}
