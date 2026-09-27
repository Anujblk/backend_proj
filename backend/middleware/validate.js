import { validationResult } from "express-validator";

export function validate(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
}
