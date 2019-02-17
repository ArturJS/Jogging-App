const createExtension = require('./utils/create-extension');

module.exports = createExtension({
    webpack(config) {
        // see also https://github.com/aws-amplify/amplify-js/issues/686#issuecomment-387710340
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        });

        return config;
    }
});
