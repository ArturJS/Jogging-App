// @flow
import joi from 'joi';

const { DATABASE_URL } = process.env;
const validationSchema = joi
    .string()
    .uri()
    .required();
const { error } = joi.validate(DATABASE_URL, validationSchema);

if (error) {
    throw new Error(
        `Config validation error: invalid value of parameter DATABASE_URL="${String(
            DATABASE_URL
        )}"`
    );
}

export const db = {
    client: 'pg',
    connection: DATABASE_URL
};
