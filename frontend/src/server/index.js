require('../../scripts/tools/babel/fix-node-modules');
require('@babel/register')();

const noop = () => {};

require.extensions['.scss'] = noop;
require.extensions['.css'] = noop;

require('./dotenv-import');

module.exports = require('./main.js').default;
