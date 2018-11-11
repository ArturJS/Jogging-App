import { Op } from 'sequelize';
import db from '../../models';

const mapRecord = record => ({
    id: record.id,
    date: record.date,
    distance: record.distance,
    time: record.time,
    averageSpeed: record.averageSpeed
});

const recordsDAL = {
    async getAllRecords({ userId, startDate, endDate }) {
        const records = await db.Record.findAll({
            where: {
                userId,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        return records.map(mapRecord);
    },

    async getRecord({ id, userId }) {
        const record = await db.Record.findOne({
            where: {
                id,
                userId
            }
        });

        return mapRecord(record);
    },

    async createRecord({ date, distance, time, averageSpeed, userId }) {
        const record = await db.Record.create({
            date,
            distance,
            time,
            averageSpeed,
            userId
        });

        return mapRecord(record);
    },

    async updateRecord({ id, date, distance, time, averageSpeed, userId }) {
        const affectedRecords = await db.Record.update(
            {
                date,
                distance,
                time,
                averageSpeed
            },
            {
                where: {
                    id,
                    userId
                },
                returning: true,
                plain: true
            }
        );
        const record = affectedRecords[1];

        return mapRecord(record);
    },

    async deleteRecord({ id, userId }) {
        await db.Record.destroy({
            where: {
                id,
                userId
            }
        });
    }
};

export default recordsDAL;
