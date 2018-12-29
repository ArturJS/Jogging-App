module.exports = (config, excludeRegExp) => {
    config.module.rules.push({
        test: excludeRegExp,
        use: 'null-loader'
    });

    return config;
};
