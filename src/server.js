import Express from 'express';
import http from 'http';

import config from './config';
import { initStaticServer } from './server/static-server';
import { initAPIServer } from './server/api-server';
import { initSSRServer } from './server/ssr-server';

const app = new Express();
const server = new http.Server(app);

initStaticServer(app);
initAPIServer(app, server);
initSSRServer(app);

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
