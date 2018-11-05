import path from 'path';
import fs from 'fs';
import http2 from 'http2';
import Koa from 'koa';
import mount from 'koa-mount';
// koa-compress not working due to https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa
import connect from 'koa-connect';
import compression from './server/common/middlewares/compression';
import config from './config';
import { initAPIServer } from './server/api-server';
import { ssrServer } from './server/ssr-server';

const app = new Koa();
const server = http2.createSecureServer(
    {
        key: fs.readFileSync(path.resolve(__dirname, './certs/selfsigned.key')),
        cert: fs.readFileSync(path.resolve(__dirname, './certs/selfsigned.crt'))
    },
    app.callback()
);

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
