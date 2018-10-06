const ExtractTextPlugin = require('extract-text-webpack-plugin');
const excludeModule = require('./utils/exclude-module');
const createExtension = require('./utils/create-extension');

module.exports = createExtension({
    webpack(config, options) {
        const { dev, isServer } = options;
        const production = !dev;

        if (dev) {
            if (isServer) {
                excludeModule(config, /\.s?css$/);
            } else {
                config.module.rules.push({
                    test: /\.s?css$/,
                    loader:
                        'style-loader!css-loader?importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss-loader?parser=postcss-scss&sourceMap=true!sass-loader?outputStyle=expanded&sourceMap'
                });
            }
        } else if (production) {
            config.module.rules.push({
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use:
                        'css-loader?importLoaders=2&minimize=true!postcss-loader?parser=postcss-scss!sass-loader?outputStyle=expanded'
                })
            });
            config.plugins.push(
                new ExtractTextPlugin({
                    filename: '[name].css?v=[contenthash]',
                    allChunks: true
                })
            );
        }

        return config;
    }
});
