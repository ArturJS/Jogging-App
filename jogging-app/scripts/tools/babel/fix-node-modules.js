const { addHook } = require('pirates');

// in order to fix issues with http2 and apollo (in "node-fetch" library)
// see also
// https://github.com/apollographql/apollo-server/issues/1533
// https://github.com/bitinn/node-fetch/issues/401

addHook(
    code =>
        code.replace(
            'const invalidTokenRegex =',
            'const invalidTokenRegex = { test: () => false }; // '
        ),
    {
        exts: ['.js'],
        matcher: filename => /node-fetch/.test(filename),
        ignoreNodeModules: false
    }
);
