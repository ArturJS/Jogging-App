import { isAuthenticatedResolver } from '../acl';
import db from '../../models';

const calcAverageSpeed = record => (record.distance / record.time) * 3.6;

export const addRecord = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const { record } = args;

        record.userId = context.userId;
        record.averageSpeed = calcAverageSpeed(record);

        const createdRecord = await db.Record.create(record);

        return createdRecord;
    }
);

export const updateRecord = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const { record, id } = args;

        record.averageSpeed = calcAverageSpeed(record);

        await db.Record.update(record, {
            where: {
                id,
                userId: context.userId
            },
            returning: true,
            plain: true
        });

        return {
            // todo reconsider the data we're returning
            id,
            ...record
        };
    }
);

export const deleteRecord = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        await db.Record.destroy({
            where: {
                id: args.id,
                userId: context.userId
            }
        });
    }
);
