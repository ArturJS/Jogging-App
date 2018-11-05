import Koa from 'koa';
import http from 'http';
import mount from 'koa-mount';
// koa-compress not working due to https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa
import compression from 'compression';
import connect from 'koa-connect';
import config from './config';
import { initAPIServer } from './server/api-server';
import { ssrServer } from './server/ssr-server';

const app = new Koa();
const server = new http.Server(app.callback());

app.use(connect(compression()));

initAPIServer(app);

app.use(mount('/', ssrServer));

// todo introduce config validation
if (config.port) {
    server.listen(config.port, err => {
        if (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
        // eslint-disable-next-line no-console
        console.info(
            `----\n==> ✅  ${
                config.app.title
            } is running, talking to API server on ${config.uiTargetUrl}.`
        );
        // eslint-disable-next-line no-console
        console.info(
            `==> 💻  Open ${config.uiTargetUrl} in a browser to view the app.`
        );
    });
} else {
    // eslint-disable-next-line no-console
    console.error(
        '==>     ERROR: No PORT environment variable has been specified'
    );
}
