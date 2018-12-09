import baseResolver from '../base-resolver';
import e2eTestsDAL from './e2e-tests.dal';
import authBLL from '../auth/auth.bll';
import recordsBLL from '../records/records.bll';

export const createAll = baseResolver.createResolver(async (root, args) => {
    const { users } = args.allData;

    // eslint-disable-next-line no-restricted-syntax
    for (const user of users) {
        // eslint-disable-next-line no-await-in-loop
        const { id: userId } = await authBLL.createUser({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password
        });
        const { records } = user;

        // eslint-disable-next-line no-restricted-syntax
        for (const record of records) {
            // eslint-disable-next-line no-await-in-loop
            await recordsBLL.createRecord({
                date: record.date,
                distance: record.distance,
                time: record.time,
                userId
            });
        }
    }

    return true;
});

export const dropAll = baseResolver.createResolver(async () => {
    await e2eTestsDAL.dropAll();

    return true;
});
