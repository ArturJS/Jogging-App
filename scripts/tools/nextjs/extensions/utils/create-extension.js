const _ = require('lodash');

module.exports = nextConfigFromExtension => {
    const supportedParams = ['webpack'];
    const notSupportedParams = _.keys(
        _.omit(nextConfigFromExtension, supportedParams)
    );

    if (notSupportedParams.length > 0) {
        throw new Error(
            [
                'Not implemented params error!',
                'Following list of params currently not supported by create-extensions.js: ',
                notSupportedParams.join(',')
            ].join('')
        );
    }

    return (nextConfig = {}) => ({
        ...nextConfig,
        webpack(config, options) {
            const getMethod = mayBeMethod =>
                _.isFunction(mayBeMethod) ? mayBeMethod : _.identity;
            const withOptionsParam = method => config =>
                method(config, options);
            const webpackMethodFrom = {
                nextConfig: getMethod(nextConfig.webpack),
                nextConfigFromExtension: getMethod(
                    nextConfigFromExtension.webpack
                )
            };

            return _.flow([
                withOptionsParam(webpackMethodFrom.nextConfigFromExtension),
                withOptionsParam(webpackMethodFrom.nextConfig)
            ])(config);
        }
    });
};
