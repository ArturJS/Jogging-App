const devConnectionString = 'postgres://postgres:root@127.0.0.1:5432/jogging-app';
const {DATABASE_URL = devConnectionString} = process.env;

const dbParamsRegExp = new RegExp([
  '^[^:]+:\/\/',  // scheme
  '([^:]+):',     // username
  '([^@]+)@',     // password
  '([^:]+):',     // host
  '([^/]+)\\/',   // port
  '(.+)$'         // database
].join(''));

const [,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOSTNAME,
  DB_PORT,
  DB_NAME
] = dbParamsRegExp.exec(DATABASE_URL);

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    port: DB_PORT,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOSTNAME,
    port: DB_PORT,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  }
};
