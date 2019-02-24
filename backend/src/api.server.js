import _ from 'lodash';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import { Strategy } from 'passport-local';
import { ApolloServer } from 'apollo-server-koa';
import noCache from 'koa-no-cache';
import config from './config';
import graphqlSchema from './modules';
import { baseDIContainer } from './di/base-di-container';

const authService = baseDIContainer.getAuthService();

const initPassport = app => {
    // Serialize Sessions
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Deserialize Sessions
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    // For Authentication Purposes
    passport.use(
        new Strategy(async (email, password, done) => {
            try {
                const user = await authService.getUser({ email, password });

                done(null, user);
            } catch (err) {
                done(null, false);
            }
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
};

export const initAPIServer = app => {
    // eslint-disable-next-line no-param-reassign
    app.keys = [config.authSessionSecret];

    app.use(bodyParser())
        .use(session({}, app))
        .use(
            noCache({
                paths: ['/graphql']
            })
        );

    initPassport(app);

    const apolloServer = new ApolloServer({
        schema: graphqlSchema,
        pretty: true,
        context: async ({ ctx }) => {
            const { login, logout, req, res } = ctx;

            return {
                userId: _.get(ctx, 'session.passport.user.id', null),
                auth: {
                    login,
                    logout
                },
                req,
                res
            };
        }
    });

    apolloServer.applyMiddleware({ app, cors: false });
};
