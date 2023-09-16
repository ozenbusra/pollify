const { check } = require("express-validator");

const check_title = () => {
  return [
    check('title')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Title can not be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail()
  ]
};

const validate_form = [
  check_title(),
];

module.exports = {
  validate_form
}