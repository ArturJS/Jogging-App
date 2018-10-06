const createExtension = require('./utils/create-extension');

module.exports = createExtension({
    webpack(config, options) {
        config.module.rules.push(
            {
                test: /\.woff2?(\?\S*)?$/,
                // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
                // loader: "url?limit=10000"
                use: 'url-loader'
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        );

        return config;
    }
});
