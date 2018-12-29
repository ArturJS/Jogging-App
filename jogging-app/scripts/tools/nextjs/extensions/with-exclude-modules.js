const excludeModule = require('./utils/exclude-module');
const createExtension = require('./utils/create-extension');

module.exports = createExtension({
    webpack(config, options) {
        const newConfig = excludeModule(config, /source-map-support/);

        return newConfig;
    }
});
