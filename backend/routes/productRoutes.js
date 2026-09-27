import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import {
  createProductValidation,
  productIdValidation,
  updateProductValidation,
} from "../validators/productValidators.js";

const router = Router();

router.post(
  "/",
  authenticate,
  createProductValidation,
  validate,
  createProduct
);

router.get("/", getProducts);

router.get(
  "/:id",
  productIdValidation,
  validate,
  getProduct
);

router.put(
  "/:id",
  authenticate,
  updateProductValidation,
  validate,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  productIdValidation,
  validate,
  deleteProduct
);

export default router;
