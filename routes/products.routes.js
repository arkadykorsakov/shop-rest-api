import express from "express";
import productController from "../controllers/product.controller.js";
import {
  productStoreValidation,
  productUpdateValidation,
} from "../validators/product.validator.js";
import uploadMiddleware from "../middleware/upload.middleware.js";
import handleValidationErrorsMiddleware from "../middleware/handleValidationErrors.middleware.js";
import existsObjectMiddleware from "../middleware/existsObject.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// @desc    get all products
// @route   GET /api/products
// @access  Public
router.get("/", productController.index);

// @desc    get product by id
// @route   GET /api/products/:id
// @access  Public
router.get(
  "/:id",
  existsObjectMiddleware("product", "Продукт не найден"),
  productController.show,
);

// @desc    crete product
// @route   POST /api/products
// @access  Auth, Admin
router.post(
  "/",
  authMiddleware,
  // roleMiddleware("ADMIN"),
  uploadMiddleware.single("image"),
  productStoreValidation,
  handleValidationErrorsMiddleware,
  productController.store,
);

// @desc    update product by id
// @route   PATCH /api/products/:id
// @access  Auth, Admin
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  uploadMiddleware.single("image"),
  existsObjectMiddleware("product", "Продукт не найден"),
  productUpdateValidation,
  handleValidationErrorsMiddleware,
  productController.update,
);

// @desc    delete product by id
// @route   DELETE /api/products/:id
// @access  Auth, Admin
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  uploadMiddleware.single("image"),
  existsObjectMiddleware("product", "Продукт не найден"),
  productController.destroy,
);

export default router;
