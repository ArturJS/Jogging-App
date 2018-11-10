import { isAuthenticatedResolver } from '../acl';
import reportsBLL from './reports.bll';

export const reports = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        // eslint-disable-next-line no-shadow
        const reports = reportsBLL.getReports({
            userId: context.userId
        });

        return reports;
    }
);
