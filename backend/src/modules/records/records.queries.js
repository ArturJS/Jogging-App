import { isAuthenticatedResolver } from '../acl';
import { baseDIContainer } from '../../di';

const recordsService = baseDIContainer.getRecordsService();

export const records = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const { filter: { startDate, endDate } = {} } = args;
        // eslint-disable-next-line no-shadow
        const records = await recordsService.getAllRecords({
            userId: context.userId,
            startDate,
            endDate
        });

        return records;
    }
);

export const record = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const { id } = args;
        const { userId } = context;
        // eslint-disable-next-line no-shadow
        const record = await recordsService.getRecord({
            id,
            userId
        });

        return record;
    }
);
