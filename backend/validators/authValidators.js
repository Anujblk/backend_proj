import { body, cookie } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("Password must include at least one letter and one number."),

  body("confirmPassword")
    .isString()
    .withMessage("Confirm password must be a string.")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password is required.")
    .notEmpty()
    .withMessage("Password is required."),
];

export const refreshTokenValidation = [
  cookie("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required."),
];
