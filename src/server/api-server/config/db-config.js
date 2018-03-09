const devConnectionString = 'postgres://postgres:root@127.0.0.1:5432/jogging-app';
const {DATABASE_URL = devConnectionString} = process.env;

module.exports = {
  development: {
    connectionString: devConnectionString,
    dialect: 'postgres',
    dialectOptions: {
      connectionString: devConnectionString,
    }
  },
  production: {
    connectionString: DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      connectionString: DATABASE_URL,
    }
  }
};
