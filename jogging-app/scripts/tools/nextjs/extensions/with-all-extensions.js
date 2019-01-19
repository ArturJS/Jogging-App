const _ = require('lodash');
const withExcludeModules = require('./with-exclude-modules');
const withFonts = require('./with-fonts');
const withStyles = require('./with-styles');
const withFixGraphql = require('./with-fix-graphql');
const withTranspileModules = require('./with-transpile-local-modules');
const withResolveAlases = require('./with-resolve-aliases');

module.exports = _.flow([
    withExcludeModules,
    withFonts,
    withStyles,
    withFixGraphql,
    withTranspileModules({
        transpileModules: ['next-routes']
    }),
    withResolveAlases
]);
