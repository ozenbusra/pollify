const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require("./models");

// Configure Passport local strategy for authentication
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ where: { email: username } })
    .then((user) => {
      if (!user || user.password !== password) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    })
    .catch((err) => done(err));
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

module.exports = passport;