import path from 'path';
import next from 'next';
import routes from 'routes';
import Koa from 'koa';
import Router from 'koa-router';
// import mount from 'koa-mount';
// import serveStatic from 'koa-static';
// import favicon from 'koa-favicon';
import { authService } from '../shared/services';
import config from './config';

const dev = config.isDevelopment;
const uiDirectory = path.resolve(__dirname, '../client');
const nextApp = next({ dir: uiDirectory, dev });
const handle = routes.getRequestHandler(nextApp);
const router = new Router();
const server = new Koa();

nextApp.prepare().then(() => {
    router.get('*', async ctx => {
        const baseUrl = `${ctx.protocol}://${ctx.host}`;
        const isLoggedIn = ctx.isAuthenticated();

        authService.setIsLoggedIn(isLoggedIn);

        ctx.req.appMeta = {
            isLoggedIn,
            cookie: ctx.header.cookie,
            baseUrl,
            baseApiUrl: `${baseUrl}/graphql`
        };

        await handle(ctx.req, ctx.res);

        ctx.respond = false;
    });

    server
        // .use( // todo figure out why do we need this
        //     favicon(
        //         path.resolve(__dirname, '../../..', 'static', 'favicon.ico')
        //     )
        // )
        // .use(
        //     mount(
        //         '/static',
        //         serveStatic(path.resolve(__dirname, '../../..', 'static'))
        //     )
        // )
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
