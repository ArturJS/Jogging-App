import _ from 'lodash';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import { Strategy } from 'passport-local';
import { ApolloServer } from 'apollo-server-koa';
// import cors from '@koa/cors';
// import noCache from 'koa-no-cache';
import schema from './components/index';
import db from './models';

const initPassport = app => {
    // Serialize Sessions
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Deserialize Sessions
    passport.deserializeUser((user, done) => {
        // todo use user from cookie
        db.User.find({ where: { email: user.email } })
            // eslint-disable-next-line no-shadow
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
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
    // todo use .env
    const AUTH_SESSION_SECRET = 'AUTH_SESSION_SECRET123';

    app.keys = [AUTH_SESSION_SECRET];

    app.use(bodyParser()).use(session({}, app));
    // app.use(cors());
    // app.use(
    //     noCache({
    //         paths: ['/graphql']
    //     })
    // );

    initPassport(app);

    const apolloServer = new ApolloServer({
        schema,
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

    apolloServer.applyMiddleware({ app });
};
