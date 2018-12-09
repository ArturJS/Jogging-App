import joi from 'joi';

const { NODE_ENV, IS_E2E } = process.env;
const validationSchema = joi
    .object({
        NODE_ENV: joi
            .string()
            .only(['development', 'production'])
            .required(),
        IS_E2E: joi.boolean()
    })
    .required();
const { error } = joi.validate(
    {
        NODE_ENV,
        IS_E2E
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
    isDevelopment: NODE_ENV === 'development',
    isProduction: NODE_ENV === 'production',
    isE2E: IS_E2E === 'true'
};
