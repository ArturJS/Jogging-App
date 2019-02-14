const createExtension = require('./utils/create-extension');

module.exports = createExtension({
    webpack(config) {
        // disable sourcemaps of webpack
        // eslint-disable-next-line no-param-reassign
        config.devtool = false;

        // disable soucemaps of babel-loader
        // eslint-disable-next-line no-restricted-syntax
        for (const rule of config.module.rules) {
            if (rule.loader === 'babel-loader') {
                rule.options.sourceMaps = false;
            }
        }

        return config;
    }
});
