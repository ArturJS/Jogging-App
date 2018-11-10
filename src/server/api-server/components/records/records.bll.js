import _ from 'lodash';
import recordsDAL from './records.dal';

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

        return mapRecord(record);
    },

    async createRecord({ date, distance, time, userId }) {
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
    }
};

export default recordsBLL;
