const defaultTimeout = 30000;
const baseUrl = 'http://localhost:3000';

const config = {
    baseUrl,
    baseApiUrl: `${baseUrl}/graphql`,
    requestTimeout: defaultTimeout,
    visitTimeout: defaultTimeout
};

export default config;
