import baseResolver from '../base-resolver';
import e2eTestsDAL from './e2e-tests.dal';

export const createAll = baseResolver.createResolver(async (root, args) => {
    const { allData } = args;

    console.log({
        allData
    });
});

export const dropAll = baseResolver.createResolver(async () => {
    await e2eTestsDAL.dropAll();
});
