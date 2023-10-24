const { body } = require("express-validator");

module.exports = {
  register: [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email not valid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password minimum 8 character"),
  ],
  login: [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email not valid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password minimum 8 character"),
  ],
  changePassword: [
    body("new_password")
      .notEmpty()
      .withMessage("new_password is required")
      .isLength({ min: 8 })
      .withMessage("Password minimum 8 character"),
  ],
};
