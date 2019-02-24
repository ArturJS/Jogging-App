import Koa from 'koa';
// koa-compress not working due to https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa
import connect from 'koa-connect';
import compression from 'compression';
import config from './config';
import initHttpServer from './initializers/init-http-server';
import connectToDatabase from './initializers/connect-to-database';
import { initAPIServer } from './api.server';

connectToDatabase();

const app = new Koa();
const server = initHttpServer(app.callback());

if (config.isProduction) {
    app.use(connect(compression()));
}

initAPIServer(app);

server.listen(config.port, err => {
    if (err) {
        throw err;
    }
    // eslint-disable-next-line no-console
    console.info(
        `==> 💻 ✅ Backend server is up and running on ${config.port} port.`
    );
});
