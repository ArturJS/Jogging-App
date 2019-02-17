export class E2ETestsBLL {
    constructor(e2eTestsDAL, authBLL, recordsBLL) {
        this._e2eTestsDAL = e2eTestsDAL;
        this._authBLL = authBLL;
        this._recordsBLL = recordsBLL;
    }

    async dropAll() {
        await this._e2eTestsDAL.dropAll();
    }

    async createAll({ users }) {
        // eslint-disable-next-line no-restricted-syntax
        for (const user of users) {
            // eslint-disable-next-line no-await-in-loop
            const { id: userId } = await this._authBLL.createUser({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password
            });
            const { records } = user;

            // eslint-disable-next-line no-restricted-syntax
            for (const record of records) {
                // eslint-disable-next-line no-await-in-loop
                await this._recordsBLL.createRecord({
                    date: record.date,
                    distance: record.distance,
                    time: record.time,
                    userId
                });
            }
        }
    }
}
