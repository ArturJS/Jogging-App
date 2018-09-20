import { UserError } from 'graphql-errors';
import { SignUpType, UserType, SignInType } from './schema';
import { GraphQLBoolean } from 'graphql';
import { authUtils } from '../../utils';
import db from '../../models';

const waitForLogin = (req, user) =>
  new Promise((resolve, reject) => {
    req.login(user, {}, err => {
      if (err) {
        reject(new UserError(`Sign In failed. ${err}`));
      }

      return resolve(user);
    });
  });

export const signIn = {
  type: UserType,
  description: 'Sign In',
  args: {
    signIn: {
      name: 'Sign In Object',
      type: SignInType
    }
  },
  resolve: (root, args, { req }) => {
    const { signIn } = args;

    return new Promise((resolve, reject) => {
      db.User.find({
        where: {
          email: signIn.email
        }
      }).then(user => {
        if (!user) {
          reject(new UserError('Wrong email or password'));

          return;
        }

        db.User.validPassword(
          signIn.password,
          user.password,
          (error, user) => {
            if (error) {
              reject(new UserError(error));

              return;
            }

            resolve(user);
          },
          user
        );

        req.login(user, {}, err => {
          if (err) {
            reject(new UserError(`Sign In failed. ${err}`));
          }
        });
      });
    });
  }
};

export const signOut = {
  type: GraphQLBoolean,
  description: 'Sign Out',
  resolve: async (root, args, { req, res }) => {
    authUtils.destroySession(req, res);
  }
};

export const signUp = {
  type: UserType,
  description: 'Sign Up',
  args: {
    signUp: {
      name: 'Sign Up Object',
      type: SignUpType
    }
  },
  resolve: async (root, args, { req, res }) => {
    await _validateSignUp(args.signUp);

    const { firstName, lastName, email, password } = args.signUp;

    const user = {
      firstName,
      lastName,
      email
    };

    try {
      await db.User.create({
        ...user,
        password
      });
    } catch (err) {
      throw new UserError(`Sign Up failed. ${err}`);
    }

    await waitForLogin(req, user);

    return user;
  }
};

async function _validateSignUp(signUpPayload) {
  await _passwordValidator(signUpPayload);
  await _emailUniquenessValidator(signUpPayload);
}

async function _passwordValidator(signUpPayload) {
  const { password, repeatPassword } = signUpPayload;

  if (password !== repeatPassword) {
    throw new UserError('Password and repeat password do not match!');
  }
}

async function _emailUniquenessValidator(signUpPayload) {
  const { email } = signUpPayload;
  const userWithSameEmail = await db.User.find({ where: { email } });

  if (userWithSameEmail) {
    throw new UserError('User with the same email already exists!');
  }
}
