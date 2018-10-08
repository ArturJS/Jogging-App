require('@babel/register')();

const noop = () => {};

require.extensions['.scss'] = noop;
require.extensions['.css'] = noop;

require('./dotenv-import');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false; // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__PRODUCTION__ = process.env.NODE_ENV === 'production';

// if (__DEVELOPMENT__) {
//   if (
//     !require('piping')({
//       hook: true,
//       ignore: /(\/\.|~$|\.json|\.scss$)/i
//     })
//   ) {
//     return;
//   }
// }

module.exports = require('./server.js').default;
