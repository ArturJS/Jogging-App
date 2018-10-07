import path from 'path';
import next from 'next';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import routes from 'routes';

global.webpackIsomorphicTools = new WebpackIsomorphicTools(
  require('../../../webpack/webpack-isomorphic-tools')
);

const dev = process.env.NODE_ENV !== 'production';
const uiDirectory = path.resolve(__dirname, '../../client');
const nextApp = next({ dir: uiDirectory, dev });
const handle = routes.getRequestHandler(nextApp);

export const initSSRServer = async app => {
  const rootDir = path.resolve(__dirname, '../../..');

  await webpackIsomorphicTools.server(rootDir);

  await nextApp.prepare();

  app.get('*', (req, res) => {
    return handle(req, res);
  });
};
