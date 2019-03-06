import { isAuthenticatedResolver } from '../acl';
import { baseDIContainer } from '../../di';

const recordsService = baseDIContainer.getReportsService();

export const reports = isAuthenticatedResolver.createResolver(
    async (root, args, context) => {
        // eslint-disable-next-line no-shadow
        const reports = recordsService.getReports({
            userId: context.userId
        });

        return reports;
    }
);
