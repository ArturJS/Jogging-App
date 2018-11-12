import _ from 'lodash';
import recordsDAL from './records.dal';
import {
    ErrorRecordAlreadyExists,
    ErrorRecordNotFound
} from './records.errors';

const calcAverageSpeed = ({ distance, time }) => (distance / time) * 3.6;

const mapRecord = record => ({
    id: record.id,
    date: record.date,
    distance: record.distance,
    time: record.time,
    averageSpeed: record.averageSpeed
});

const MAX_DATE = Number.MAX_SAFE_INTEGER;
const MIN_DATE = -MAX_DATE;

const recordsBLL = {
    async getAllRecords({ userId, startDate, endDate }) {
        const records = await recordsDAL.getAllRecords({
            userId,
            startDate: startDate || MIN_DATE,
            endDate: endDate || MAX_DATE
        });

        return _.sortBy(records, 'date').map(mapRecord);
    },

    async getRecord({ id, userId }) {
        const record = await recordsDAL.getRecord({ id, userId });

        if (!record) {
            throw new ErrorRecordNotFound();
        }

        return mapRecord(record);
    },

    async createRecord({ date, distance, time, userId }) {
        await this._validateDateIsUniq({ date, userId });

        const record = await recordsDAL.createRecord({
            date,
            distance,
            time,
            averageSpeed: calcAverageSpeed({ distance, time }),
            userId
        });

        return mapRecord(record);
    },

    async updateRecord({ id, date, distance, time, userId }) {
        await this._validateDateIsUniq({ id, date, userId });

        const record = await recordsDAL.updateRecord({
            id,
            date,
            distance,
            time,
            averageSpeed: calcAverageSpeed({ distance, time }),
            userId
        });

        return mapRecord(record);
    },

    async deleteRecord({ id, userId }) {
        await recordsDAL.deleteRecord({ id, userId });
    },

    async _validateDateIsUniq({ id = null, date, userId }) {
        const isTheSameRecord = await recordsDAL.hasRecordByDate({
            id,
            date,
            userId
        });

        if (isTheSameRecord) {
            throw new ErrorRecordAlreadyExists();
        }
    }
};

export default recordsBLL;
