import Koa from 'koa';
import http from 'http';
import mount from 'koa-mount';
import config from './config';
import { initAPIServer } from './server/api-server';
import { ssrServer } from './server/ssr-server';

const app = new Koa();
const server = new http.Server(app.callback());

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
