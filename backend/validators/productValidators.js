import { body, param } from "express-validator";

const productBodyFields = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 200 })
    .withMessage("Name cannot exceed 200 characters."),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0.")
    .toFloat(),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer.")
    .toInt(),
];

export const createProductValidation = [...productBodyFields];

export const updateProductValidation = [
  param("id")
    .isMongoId()
    .withMessage("Product id must be a valid MongoDB ObjectId."),

  ...productBodyFields,
];

export const productIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Product id must be a valid MongoDB ObjectId."),
];
