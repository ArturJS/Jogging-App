import joi from 'joi';

const { AUTH_SESSION_SECRET } = process.env;
const validationSchema = joi
    .object({
        AUTH_SESSION_SECRET: joi.string().required()
    })
    .required();
const { error } = joi.validate(
    {
        AUTH_SESSION_SECRET
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const auth = {
    authSessionSecret: AUTH_SESSION_SECRET
};
