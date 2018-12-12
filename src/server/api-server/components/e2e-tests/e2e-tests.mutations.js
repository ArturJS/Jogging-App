import baseResolver from '../base-resolver';
import e2eTestsDAL from './e2e-tests.dal';
import authBLL from '../auth/auth.bll';
import recordsBLL from '../records/records.bll';

const dropAll = async () => {
    await e2eTestsDAL.dropAll();
};

const createAll = async ({ users }) => {
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
};

export const resetAll = baseResolver.createResolver(async (root, args) => {
    await dropAll();
    await createAll(args.allData);

    return true;
});
