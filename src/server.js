import path from 'path';
import fs from 'fs';
import http2 from 'http2';
import Koa from 'koa';
import mount from 'koa-mount';
// koa-compress not working due to https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa
import connect from 'koa-connect';
import compression from './server/common/middlewares/compression';
import config from './server/common/config';
import { initAPIServer } from './server/api-server';
import { ssrServer } from './server/ssr-server';

const enforceHttps = () => {
    new Koa()
        .use(ctx => {
            ctx.status = 301;
            ctx.redirect(`https://${ctx.host}${ctx.originalUrl}`);
        })
        .listen(80);
};
const app = new Koa();
const server = http2.createSecureServer(
    {
        key: fs.readFileSync(path.resolve(__dirname, './certs/selfsigned.key')),
        cert: fs.readFileSync(path.resolve(__dirname, './certs/selfsigned.crt'))
    },
    app.callback()
);

if (config.isProduction) {
    app.use(connect(compression()));
    enforceHttps();
}

initAPIServer(app);

app.use(mount('/', ssrServer));

server.listen(config.port, err => {
    if (err) {
        throw err;
    }
    // eslint-disable-next-line no-console
    console.info(`==> 💻 ✅ Server is up and running on ${config.port} port.`);
});
