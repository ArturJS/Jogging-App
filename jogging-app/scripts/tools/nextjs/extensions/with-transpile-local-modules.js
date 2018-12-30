module.exports = nextConfigFromExtension => (nextConfig = {}) => {
    const { transpileModules = [] } = nextConfigFromExtension;
    const includes = transpileModules.map(
        module => new RegExp(`${module}(?!.*local_modules)`)
    );
    const excludes = transpileModules.map(
        module => new RegExp(`local_modules(?!/${module}(?!.*local_modules))`)
    );

    return Object.assign({}, nextConfig, {
        webpack(config, options) {
            if (!options.defaultLoaders) {
                throw new Error(
                    'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
                );
            }

            config.resolve.symlinks = false; // eslint-disable-line no-param-reassign

            // eslint-disable-next-line no-param-reassign
            config.externals = config.externals.map(external => {
                if (typeof external !== 'function') return external;

                return (ctx, req, cb) =>
                    includes.find(include => include.test(req))
                        ? cb()
                        : external(ctx, req, cb);
            });

            config.module.rules.push({
                test: /\.+(js|jsx)$/,
                loader: options.defaultLoaders.babel,
                include: includes
            });

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options);
            }

            return config;
        },

        webpackDevMiddleware(config) {
            const ignored = [config.watchOptions.ignored[0]].concat(excludes);

            config.watchOptions.ignored = ignored; // eslint-disable-line no-param-reassign

            return config;
        }
    });
};
