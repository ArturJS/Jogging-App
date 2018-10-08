const _ = require('lodash');
const withExcludeModules = require('./with-exclude-modules');
const withFonts = require('./with-fonts');
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const withFixGraphql = require('./with-fix-graphql');

module.exports = _.flow([
  withExcludeModules,
  withFonts,
  // todo fix dev styles https://github.com/zeit/next.js/issues/5152
  withCss,
  withSass,
  withFixGraphql
]);
