import {UserError} from 'graphql-errors';
import db from '../../models';
import {SignUpType, UserType} from './schema';

export const SignUp = {
  type: UserType,
  description: 'Sign Up',
  args: {
    signUp: {
      name: 'Sign Up Object',
      type: SignUpType
    }
  },
  resolve: async (root, args, {req, res}) => {
    await _validateSignUp(args.signUp);

    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;

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

    req.login(user, {}, (err) => {
      if (err) {
        throw new UserError(`Sign In failed. ${err}`);
      }

      return res.json(user);
    });

    return user;
  }
};

async function _validateSignUp(signUpPayload) {
  await _passwordValidator(signUpPayload);
  await _emailUniquenessValidator(signUpPayload);
}

async function _passwordValidator(signUpPayload) {
  const {
    password,
    repeatPassword
  } = signUpPayload;

  if (password !== repeatPassword) {
    throw new UserError('Password and repeat password do not match!');
  }
}

async function _emailUniquenessValidator(signUpPayload) {
  const {email} = signUpPayload;
  const userWithSameEmail = await db.User.find({where: {email}});

  if (userWithSameEmail) {
    throw new UserError('User with the same email already exists!');
  }
}
