import { isAuthenticatedResolver } from '../acl';
import recordsBLL from './records.bll';

export const records = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        const { filter: { startDate, endDate } = {} } = args;
        // eslint-disable-next-line no-shadow
        const records = await recordsBLL.getAllRecords({
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
        const record = await recordsBLL.getRecord({
            id,
            userId
        });

        return record;
    }
);
