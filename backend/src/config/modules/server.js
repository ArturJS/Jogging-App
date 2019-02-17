import joi from 'joi';

const { PORT, ENFORCE_HTTPS } = process.env;
const validationSchema = joi.object({
    PORT: joi.string().required()
});
const { error } = joi.validate(
    {
        PORT
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const server = {
    port: +PORT + 1 // since frontend service is running on %PORT port
};
