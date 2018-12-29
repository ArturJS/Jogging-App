const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const findUp = require('find-up');
const excludeModule = require('./utils/exclude-module');
const createExtension = require('./utils/create-extension');

const fileExtensions = new Set();
let extractCssInitialized = false;

const cssLoaderConfig = (
  config,
  {
    extensions = [],
    cssLoaderOptions = {},
    isServer,
    postcssLoaderOptions = {},
    loaders = []
  }
) => {
  // We have to keep a list of extensions for the splitchunk config
  for (const extension of extensions) {
    fileExtensions.add(extension);
  }

  if (!isServer) {
    config.optimization.splitChunks.cacheGroups.styles = {
      name: 'styles',
      test: new RegExp(`\\.+(${[...fileExtensions].join('|')})$`),
      chunks: 'all',
      enforce: true
    };
  }

  if (!isServer && !extractCssInitialized) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
      })
    );
    extractCssInitialized = true;
  }

  const postcssConfig = findUp.sync('postcss.config.js', {
    cwd: config.context
  });
  let postcssLoader;

  if (postcssConfig) {
    // Copy the postcss-loader config options first.
    const postcssOptionsConfig = Object.assign(
      {},
      postcssLoaderOptions.config,
      { path: postcssConfig }
    );

    postcssLoader = {
      loader: 'postcss-loader',
      options: Object.assign({}, postcssLoaderOptions, {
        config: postcssOptionsConfig
      })
    };
  }

  const cssLoader = {
    loader: isServer ? 'css-loader/locals' : 'css-loader',
    options: Object.assign(
      {},
      {
        modules: false,
        minimize: true,
        sourceMap: false,
        importLoaders: loaders.length + (postcssLoader ? 1 : 0)
      },
      cssLoaderOptions
    )
  };

  // When not using css modules we don't transpile on the server
  if (isServer && !cssLoader.options.modules) {
    return ['ignore-loader'];
  }

  // When on the server and using css modules we transpile the css
  if (isServer && cssLoader.options.modules) {
    return [cssLoader, postcssLoader, ...loaders].filter(Boolean);
  }

  return [
    false,
    !isServer && MiniCssExtractPlugin.loader,
    cssLoader,
    postcssLoader,
    ...loaders
  ].filter(Boolean);
};

module.exports = createExtension({
  webpack(config, options) {
    const { dev, isServer } = options;
    const production = !dev;

    if (dev) {
      if (isServer) {
        excludeModule(config, /\.s?css$/);
      } else {
        config.module.rules.push({
          test: /\.s?css$/,
          loader:
            'style-loader!css-loader?importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss-loader?parser=postcss-scss&sourceMap=true!sass-loader?outputStyle=expanded&sourceMap'
        });
      }
    } else if (production) {
      options.defaultLoaders.sass = cssLoaderConfig(config, {
        extensions: ['scss', 'sass'],
        dev,
        isServer,
        loaders: [
          {
            loader: 'sass-loader',
            options: {}
          }
        ]
      });

      config.module.rules.push(
        {
          test: /\.s?css$/,
          use: options.defaultLoaders.sass
        },
        {
          test: /\.sass$/,
          use: options.defaultLoaders.sass
        }
      );
    }

    return config;
  }
});
