import path from 'path';
import next from 'next';
import routes from 'routes';

const dev = process.env.NODE_ENV !== 'production';
const uiDirectory = path.resolve(__dirname, '../../client');
const nextApp = next({ dir: uiDirectory, dev });
const handle = routes.getRequestHandler(nextApp);

export const initSSRServer = async app => {
  await nextApp.prepare();

  app.get('*', (req, res) => {
    return handle(req, res);
  });
};
