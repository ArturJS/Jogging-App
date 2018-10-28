require('@babel/register')();

const noop = () => {};

require.extensions['.scss'] = noop;
require.extensions['.css'] = noop;

require('./dotenv-import');

module.exports = require('./server.js').default;
