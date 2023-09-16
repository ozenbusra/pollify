const session = require('express-session');

module.exports = session({
  secret: 'SECRET_KEY_123',
  resave: false,
  saveUninitialized: false,
});