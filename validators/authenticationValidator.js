const session = require("../session")

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  const user = req.user;
  res.redirect('/login');
}
  
module.exports = {
  isAuthenticated
}