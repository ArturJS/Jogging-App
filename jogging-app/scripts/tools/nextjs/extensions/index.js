const _ = require('lodash');
const withExcludeModules = require('./with-exclude-modules');
const withFonts = require('./with-fonts');
const withStyles = require('./with-styles');
const withFixGraphql = require('./with-fix-graphql');
const withTranspileModules = require('./with-transpile-local-modules');
const withResolveAlases = require('./with-resolve-aliases');
// eslint-disable-next-line no-unused-vars
const withoutSourcemaps = require('./without-sourcemaps');

module.exports = _.flow([
    // withoutSourcemaps,
    withExcludeModules,
    withFonts,
    withStyles,
    withFixGraphql,
    withTranspileModules({
        transpileModules: ['next-routes']
    }),
    withResolveAlases
]);
