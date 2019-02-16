import { isAuthenticatedResolver } from '../acl';
import { baseDIContainer } from '../../di/base-di-container';

const recordsService = baseDIContainer.getRecordsService();

export const addRecord = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const { record } = args;
        const createdRecord = await recordsService.createRecord({
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
        const updatedRecord = await recordsService.updateRecord({
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
        await recordsService.deleteRecord({
            id: args.id,
            userId: context.userId
        });
    }
);
