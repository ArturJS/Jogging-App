import Koa from 'koa';
import mount from 'koa-mount';
// koa-compress not working due to https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa
import connect from 'koa-connect';
import compression from './middlewares/compression';
import config from './config';
import { initHttpServer, initPassport } from './initializers';
import { ssrServer } from './ssr.server';

const enforceHttps = () => {
    new Koa()
        .use(ctx => {
            ctx.status = 301;
            ctx.redirect(`https://${ctx.host}${ctx.originalUrl}`);
        })
        .listen(80);
};

if (config.enforceHttps) {
    enforceHttps();
}

const app = new Koa();
const server = initHttpServer(app.callback());

if (config.isProduction) {
    app.use(connect(compression()));
}

initPassport(app);

app.use(mount('/', ssrServer));

server.listen(config.port, err => {
    if (err) {
        throw err;
    }

    // eslint-disable-next-line no-console
    console.info(`==> 💻 ✅ Server is up and running on ${config.port} port.`);
});
