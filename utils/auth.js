const withAuth = (req, res, next) => {
  (!req.session.loggedIn) ? res.redirect('/login') : next();
};

module.exports = withAuth;
