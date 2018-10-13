const _ = require('lodash');
const withExcludeModules = require('./with-exclude-modules');
const withFonts = require('./with-fonts');
const withStyles = require('./with-styles');
const withFixGraphql = require('./with-fix-graphql');

module.exports = _.flow([
  withExcludeModules,
  withFonts,
  withStyles,
  withFixGraphql
]);
