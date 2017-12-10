import passport from 'passport';
import db from '../../models/index';
import {validationUtils} from '../../utils/validation.utils';
import {authSchemas} from './auth.schemas';


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
    const valid = await validationUtils.ensureValidation(req, res, [
      _signUpJsonValidator,
      _passwordValidator,
      _emailUniquenessValidator
    ]);

    if (!valid) return;

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

    try { // todo create service and add transactionID for any data manipulation
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
    catch(err) {
      res.status(401).end();
    }
  },
};

// validators
async function _signUpJsonValidator(req) {
  const signUpValidator = validationUtils.getValidatorBySchema(authSchemas.signUpSchema);
  const valid = signUpValidator(req.body);

  if (!valid) {
    return signUpValidator.errors;
  }
}

async function _passwordValidator(req) {
  const {
    password,
    repeatPassword
  } = req.body;

  if (password !== repeatPassword) {
    return 'Password and repeat password do not match!';
  }
}

async function _emailUniquenessValidator(req) {
  const {email} = req.body;

  const userWithSameEmail = await db.User.find({where: {email}});

  if (userWithSameEmail) {
    return 'User with the same email already exists!';
  }
}
