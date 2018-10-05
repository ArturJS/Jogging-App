require('../../../dotenv-import');

const { DATABASE_URL } = process.env;
const dbParamsRegExp = new RegExp(
  [
    '^[^:]+://', // scheme
    '([^:]+):', // username
    '([^@]+)@', // password
    '([^:]+):', // host
    '([^/]+)\\/', // port
    '(.+)$' // database
  ].join('')
);
const [
  ,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOSTNAME,
  DB_PORT,
  DB_NAME
] = dbParamsRegExp.exec(DATABASE_URL);
const dbconfig = {
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
};

module.exports = {
  development: dbconfig,
  production: dbconfig
};
