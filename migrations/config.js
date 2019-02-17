const dotenv = require('dotenv-safe');
const j = require('joi');

const importDotEnv = () => {
    dotenv.config({
        example: './.env.example',
        path: './.env'
    });

    return process.env;
};
const createConfig = ({ DATABASE_URL, POOL_MIN, POOL_MAX }) => ({
    db: {
        client: 'pg',
        connection: DATABASE_URL,
        pool: {
            min: +POOL_MIN,
            max: +POOL_MAX
        }
    }
});
const validateConfig = config => {
    const validationSchema = j
        .object({
            db: j
                .object({
                    client: j.only('pg').required(),
                    connection: j
                        .string()
                        .uri()
                        .required(),
                    pool: j
                        .object({
                            min: j.number().required(),
                            max: j.number().required()
                        })
                        .required()
                })
                .required()
        })
        .required();

    const { error } = j.validate(config, validationSchema);

    if (error) {
        throw new TypeError(`Config validation error: "${error}"`);
    }

    return config;
};
const createValidatedConfig = () => {
    const env = importDotEnv();
    const untrustedConfig = createConfig(env);
    const validatedConfig = validateConfig(untrustedConfig);

    return validatedConfig;
};

const config = createValidatedConfig();

module.exports = config;
