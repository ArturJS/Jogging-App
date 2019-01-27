import _ from 'lodash';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import { Strategy } from 'passport-local';
import { ApolloServer } from 'apollo-server-koa';
import noCache from 'koa-no-cache';
import config from '../common/config';
import graphqlSchema from './modules';
import db from './models';

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
        new Strategy((username, password, done) => {
            db.User.find({ where: { email: username } }).then(user => {
                if (!user) {
                    done(null, false);
                }

                db.User.validPassword(password, user.password, done, user);
            });
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
