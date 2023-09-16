const asyncHandler = require("express-async-handler");
const passport = require('passport')
const flash = require('connect-flash');

const index = asyncHandler(async (req, res, next) => {
  res.render("index", {
    title: "Index"
  });
});

const login_get = asyncHandler(async (req, res, next) => {
  res.render("login", {
      title: "Login",
      message: req.flash('error'),
    });
});

const login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
});

const logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = {
  index,
  login_get,
  login_post,
  logout
};