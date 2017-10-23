export const authUtils = {
  IsAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).end();
    }
  },

  destroySession: (req, res, next) => {
    req.logOut();
    if (req.session) {
      req.session.destroy();
    }
    res.json('Ok');
  }
};