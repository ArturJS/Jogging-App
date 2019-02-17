const joi = require('joi');

require('../dotenv-import');

const { DATABASE_URL } = process.env;
const validationSchema = joi
    .string()
    .uri()
    .required();
const { error } = joi.validate(DATABASE_URL, validationSchema);

if (error) {
    throw new Error(
        `Config validation error: invalid value of parameter DATABASE_URL="${DATABASE_URL}"`
    );
}

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
    },
    operatorsAliases: false
};

module.exports = {
    development: dbconfig,
    production: dbconfig
};
