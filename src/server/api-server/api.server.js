import _ from 'lodash';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy } from 'passport-local';
import expressSession from 'express-session';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './components/index';
import corsMiddleware from './middlewares/cors.middleware';
import noCacheMiddleware from './middlewares/no-cache.middleware';
import db from './models';

export const initAPIServer = app => {
  _initPassport();

  app.use(
    expressSession({
      secret: 'secret123',
      cookie: {
        httpOnly: true
      }
    })
  );
  app.use(bodyParser.json());
  app.use(corsMiddleware);
  app.use(noCacheMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  // The GraphQL endpoint
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress((req, res) => ({
      schema,
      context: {
        userId: _.get(req, 'user.id', null),
        req,
        res
      },
      pretty: true
    }))
  );

  // GraphiQL, a visual editor for queries
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
};

// private methods

function _initPassport() {
  // Serialize Sessions
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  //Deserialize Sessions
  passport.deserializeUser((user, done) => {
    db.User.find({ where: { email: user.email } })
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
          return done(null, false);
        }
        db.User.validPassword(password, user.password, done, user);
      });
    })
  );
}
