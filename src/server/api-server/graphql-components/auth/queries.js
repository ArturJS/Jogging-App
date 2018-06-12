import { GraphQLBoolean } from 'graphql';
import {UserError} from 'graphql-errors';
import {SignInType, UserType} from './schema';
import db from '../../models/index';
import {authUtils} from '../../utils';
import {withAuth} from '../utils';

export const SignIn = {
  type: UserType,
  description: 'Sign In',
  args: {
    signIn: {
      name: 'Sign In Object',
      type: SignInType
    }
  },
  resolve: (root, args, {req}) => {
    const { signIn } = args;

    return new Promise((resolve, reject) => {
      db
        .User
        .find({
          where: {
            email: signIn.email
          }
        })
        .then((user) => {
          if (!user) {
            reject(new UserError('Wrong email or password'));

            return;
          }

          db.User.validPassword(signIn.password, user.password, (error, user) => {
            if (error) {
              reject(new UserError(error));

              return;
            }

            resolve(user);
          }, user);

          req.login(user, {}, (err) => {
            if (err) {
              reject(new UserError(`Sign In failed. ${err}`));
            }
          });
        });
    });
  }
};

export const SignOut = {
  type: GraphQLBoolean,
  description: 'Sign Out',
  resolve: async (root, args, {req, res}) => {
    authUtils.destroySession(req, res);
  }
};

export const GetUserData = {
  type: UserType,
  description: 'Get user data',
  resolve: withAuth(async (root, args, context) => {
    const user = await db.User.find({
      where: {
        id: context.userId
      }
    });

    return user;
  })
};
