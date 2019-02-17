import session from 'koa-session';
import passport from 'koa-passport';
import config from '../../config';

const { authSessionSecret } = config;

export const initPassport = app => {
    // eslint-disable-next-line no-param-reassign
    app.keys = [authSessionSecret];

    app.use(session({}, app))
        .use(passport.initialize())
        .use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};
