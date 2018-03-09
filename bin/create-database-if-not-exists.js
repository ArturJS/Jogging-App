const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../src/server/api-server/config/db-config')[env];

createDatabaseIfNotExists(config);

async function createDatabaseIfNotExists(config) {
  const {
    database
  } = config;
  const sequelize = new Sequelize(config);

  try {
    const result = await sequelize.query(
      `select exists(SELECT 1 from pg_database WHERE datname='${database}');`
    );
    const {exists} = result[0][0];

    if (exists) {
      console.log(`Database "${database}" already exists.`);
    } else {
      console.log(`Creating database "${database}"...`);
      await sequelize.query(`CREATE DATABASE "${database}"`);
      console.log(`Database "${database}" successfully created!`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    sequelize.close();
  }
}
