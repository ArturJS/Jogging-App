const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../src/server/api-server/config/db-config.json')[env];

createDatabaseIfNotExists(config);

async function createDatabaseIfNotExists(config) {
  const sequelize = new Sequelize('postgres', config.username, config.password, {
    dialect: config.dialect,
    host: config.host
  });
  const {database} = config;

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
