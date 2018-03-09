const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../src/server/api-server/config/db-config');
const { connectionString } = dbConfig[env];

createDatabaseIfNotExists(connectionString);

async function createDatabaseIfNotExists(connectionString) {
  const sequelize = new Sequelize(connectionString);

  try {
    const database = /([^/])+$/.exec(connectionString)[0];
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
