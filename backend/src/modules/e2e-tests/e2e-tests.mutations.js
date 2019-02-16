import baseResolver from '../base-resolver';
import { baseDIContainer } from '../../di/base-di-container';

const e2eTestsService = baseDIContainer.getE2ETestsService();

export const resetAll = baseResolver.createResolver(async (root, args) => {
    await e2eTestsService.dropAll();
    await e2eTestsService.createAll(args.allData);

    return true;
});
