import passport from 'passport';

import db from '../models';
import {jsonValidatorsUtils} from '../utils/json-validators.utils';
import {signUpSchema} from './sign-up.schema';


const signUpValidator = jsonValidatorsUtils.getValidatorBySchema(signUpSchema);


export const authController = {
  doSignIn: async(req, res) => {
    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        res.status(401).json({
          error: 'Invalid email or password'
        });
        return;
      }
      req.login(user, {}, (err) => {
        if (err) {
          return res.json({error: err});
        }
        return res.json(user);
      });
    })(req, res);
  },

  doSignOut: (req, res) => {
    res.json('Ok');
  },

  doSignUp: async(req, res) => {
    const valid = signUpValidator(req.body);
    if (!valid) {
      res.status(400).json({error: signUpValidator.errors});
      return;
    }


    const {
      firstName,
      lastName,
      email,
      password,
      repeatPassword
    } = req.body;

    const user = {
      firstName,
      lastName,
      email
    };

    try {
      if (password !== repeatPassword) {
        throw 'Password and repeat password do not match!';
      }

      const userWithSameEmail = await db.User.find({where: {email}});

      if (userWithSameEmail) {
        throw 'User with the same email already exists!';
      }

      await db.User.create({
        ...user,
        password
      });

      req.login(user, {}, (err) => {
        if (err) {
          return res.status(400).json({error: err});
        }
        return res.json(user);
      });
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  getUserData: async(req, res) => {
    try {
      const user = await db.User.find({where: {email: 'test@user.com'}});
      res.json(user);
    }
    finally {
      res.status(401).end();
    }
  },
};