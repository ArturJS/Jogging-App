import joi from 'joi';

const { NODE_ENV } = process.env;
const validationSchema = joi
    .object({
        NODE_ENV: joi
            .string()
            .only(['development', 'production'])
            .required()
    })
    .required();
const { error } = joi.validate(
    {
        NODE_ENV
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
    isDevelopment: NODE_ENV === 'development',
    isProduction: NODE_ENV === 'production'
};
