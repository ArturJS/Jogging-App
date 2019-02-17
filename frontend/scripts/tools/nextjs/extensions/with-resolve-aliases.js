const path = require('path');
const createExtension = require('./utils/create-extension');

// by unknown reason when I extracted ./src/shared folder from ./src/client
// babel-plugin-module-resolver was failed to create alias
// for custom 'next-routes'
module.exports = createExtension({
    webpack(config) {
        const resolveAliases = {
            'next-routes': path.resolve(
                __dirname,
                '../../../../local_modules/next-routes'
            )
        };

        // eslint-disable-next-line no-param-reassign
        config.resolve.alias = Object.assign(
            {},
            config.resolve.alias,
            resolveAliases
        );

        return config;
    }
});
