import path from 'path';
import next from 'next';
import routes from 'routes';
import Koa from 'koa';
import Router from 'koa-router';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import favicon from 'koa-favicon';

const dev = process.env.NODE_ENV !== 'production';
const uiDirectory = path.resolve(__dirname, '../../client');
const nextApp = next({ dir: uiDirectory, dev });
const handle = routes.getRequestHandler(nextApp);
const router = new Router();
const server = new Koa();

nextApp.prepare().then(() => {
    router.get('*', async ctx => {
        ctx.req.isLoggedIn = ctx.isAuthenticated();
        ctx.req.protocol = ctx.protocol;
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    // todo use compression and
    // res.header('Cache-Control', 'public, max-age=31536000, immutable');
    server
        .use(
            favicon(
                path.resolve(__dirname, '../../..', 'static', 'favicon.ico')
            )
        )
        .use(
            mount(
                '/static',
                serveStatic(path.resolve(__dirname, '../../..', 'static'))
            )
        )
        .use(
            // eslint-disable-next-line no-shadow
            async (ctx, next) => {
                ctx.res.statusCode = 200;
                await next();
            }
        )
        .use(router.routes());
});

export const ssrServer = server;
