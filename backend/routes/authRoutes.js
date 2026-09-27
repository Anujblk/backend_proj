import { Router } from "express";

import {
  register,
  login,
  refreshToken,
  logout,
  me,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from "../validators/authValidators.js";

const router = Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post(
  "/refresh-token",
  refreshTokenValidation,
  validate,
  refreshToken
);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
