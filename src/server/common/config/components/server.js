import joi from 'joi';

const { PORT, ENFORCE_HTTPS } = process.env;
const validationSchema = joi.object({
    PORT: joi.string().required(),
    ENFORCE_HTTPS: joi.boolean().required()
});
const { error } = joi.validate(
    {
        PORT,
        ENFORCE_HTTPS
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const server = {
    port: PORT,
    enforceHttps: ENFORCE_HTTPS === 'true'
};
