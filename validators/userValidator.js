const { check } = require("express-validator");

const check_username = () => {
  return [
    check('username')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Username can not be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail()
  ]
};

const check_email = () => {
  return [
    check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email can not be empty!')
    .bail()
  ]
};

const check_role = () => {
  return [
    check('role')
    .not()
    .isEmpty()
    .withMessage('Role can not be empty!')
    .bail()
    .isIn(['Voter', 'Editor', 'Admin'])
    .withMessage('Role is invalid!')
    .bail()
  ]
};

const validate_create = [
  check_username(),
  check_email(),
  check_role(),
];

const validate_update = [
  check_username(),
  check_email(),
];

module.exports = {
  validate_create,
  validate_update
}