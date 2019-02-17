const bcrypt = require('bcryptjs');

const flatten = (arr, depth = 1) =>
    arr.reduce(
        (acc, value) =>
            acc.concat(
                depth > 1 && Array.isArray(value)
                    ? flatten(value, depth - 1)
                    : value
            ),
        []
    );
const sequence = length => Array.from({ length }).map((_, index) => index + 1);

const dropTables = async knex => {
    await Promise.all(
        ['record', 'user'].map(async tableName => {
            await knex.raw(
                `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`
            );
        })
    );
};
const seedUsers = async knex => {
    const users = sequence(1).map(id => ({
        id,
        firstName: `Testfirstname${id}`,
        lastName: `Testlastname${id}`,
        email: `test${id}@mail.com`,
        password: bcrypt.hashSync(`${id}`)
    }));

    await knex('user').insert(users);

    return users.map(({ id }) => id);
};
const seedRecords = async (knex, userIds) => {
    const records = flatten(
        userIds.map(userId => {
            const distance = 5000 * userId;
            const time = 2460 * userId;
            const averageSpeed = distance / time;

            return [
                {
                    userId,
                    date: 1520971200000, // 14.03.2018
                    distance,
                    time,
                    averageSpeed
                },
                {
                    userId,
                    date: 1547064000000, // 10.01.2019
                    distance: 2 * distance,
                    time: 2 * time,
                    averageSpeed: 2 * averageSpeed
                }
            ];
        })
    );

    await knex('record').insert(records);
};

module.exports = {
    async seed(knex) {
        await dropTables(knex);

        const userIds = await seedUsers(knex);

        await seedRecords(knex, userIds);
    }
};
