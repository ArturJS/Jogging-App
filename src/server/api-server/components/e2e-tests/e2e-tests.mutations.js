import baseResolver from '../base-resolver';
import e2eTestsBLL from './e2e-tests.bll';

export const resetAll = baseResolver.createResolver(async (root, args) => {
    await e2eTestsBLL.dropAll();
    await e2eTestsBLL.createAll(args.allData);

    return true;
});
