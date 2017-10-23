import passport from 'passport';
import db from '../models';


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

  doSignUp: (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      repeatPassword
    } = req.body;

    if (password !== repeatPassword) {
      const user = {
        firstName,
        lastName,
        email
      };

      req.login(user, {}, (err) => {
        if (err) {
          return res.json({error: err});
        }
        return res.json(user);
      });
    }
    else {
      res.status(400).json('Password and repeat password do not match!');
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