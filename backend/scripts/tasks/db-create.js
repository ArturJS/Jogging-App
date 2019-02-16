// eslint-disable-next-line import/newline-after-import
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../src/config/db-config')[env];

// eslint-disable-next-line no-use-before-define
createDatabaseIfNotExists(config);

// eslint-disable-next-line no-shadow
async function createDatabaseIfNotExists(config) {
    // eslint-disable-line no-shadow
    const { database } = config;
    const sequelize = new Sequelize(config);

    try {
        const result = await sequelize.query(
            `select exists(SELECT 1 from pg_database WHERE datname='${database}');`
        );
        const { exists } = result[0][0];

        if (exists) {
            // eslint-disable-next-line no-console
            console.log(`Database "${database}" already exists.`);
        } else {
            // eslint-disable-next-line no-console
            console.log(`Creating database "${database}"...`);
            await sequelize.query(`CREATE DATABASE "${database}"`);
            // eslint-disable-next-line no-console
            console.log(`Database "${database}" successfully created!`);
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    } finally {
        sequelize.close();
    }
}
