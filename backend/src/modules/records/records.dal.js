import { Record } from '../../db';

const mapRecord = record => ({
    id: record.id,
    date: record.date,
    distance: record.distance,
    time: record.time,
    averageSpeed: record.averageSpeed
});

export class RecordsDAL {
    constructor() {
        this._recordModel = Record;
    }

    async getAllRecords({ userId, startDate, endDate }) {
        const records = await this._recordModel
            .query()
            .where({
                userId
            })
            .whereBetween('date', [startDate, endDate]);

        return records.map(mapRecord);
    }

    async getRecordById({ id, userId }) {
        const record = await this._recordModel
            .query()
            .where({
                id,
                userId
            })
            .first();

        if (!record) {
            return null;
        }

        return mapRecord(record);
    }

    async hasRecordByDate({ id, date, userId }) {
        const recordsCount = await this._recordModel
            .query()
            .whereNot({ id })
            .andWhere({
                date,
                userId
            })
            .count();

        return recordsCount > 0;
    }

    async createRecord({ date, distance, time, averageSpeed, userId }) {
        const record = await this._recordModel.query().insert({
            date,
            distance,
            time,
            averageSpeed,
            userId
        });

        return mapRecord(record);
    }

    async updateRecord({ id, date, distance, time, averageSpeed, userId }) {
        const record = await this._recordModel
            .query()
            .where({ id, userId })
            .update({
                date,
                distance,
                time,
                averageSpeed
            })
            .returning('*')
            .first();

        return mapRecord(record);
    }

    async deleteRecord({ id, userId }) {
        await this._recordModel
            .query()
            .where({
                id,
                userId
            })
            .delete();
    }
}
