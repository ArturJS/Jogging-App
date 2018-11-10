import { isAuthenticatedResolver } from '../acl';
import recordsBLL from './records.bll';

export const addRecord = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const { record } = args;
        const createdRecord = await recordsBLL.createRecord({
            date: record.date,
            distance: record.distance,
            time: record.time,
            userId: context.userId
        });

        return createdRecord;
    }
);

export const updateRecord = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const { record, id } = args;
        const updatedRecord = await recordsBLL.updateRecord({
            id,
            date: record.date,
            distance: record.distance,
            time: record.time,
            userId: context.userId
        });

        return updatedRecord;
    }
);

export const deleteRecord = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        await recordsBLL.deleteRecord({
            id: args.id,
            userId: context.userId
        });
    }
);
