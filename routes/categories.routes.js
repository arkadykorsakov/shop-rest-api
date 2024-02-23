import express from "express";
import categoryController from "../controllers/category.controller.js";
import handleValidationErrorsMiddleware from "../middleware/handleValidationErrors.middleware.js";
import existsObjectMiddleware from "../middleware/existsObject.middleware.js";
import categoryValidation from "../validators/category.validator.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// @desc    get all categories
// @route   GET /api/categories
// @access  Public
router.get("/", categoryController.index);

// @desc    get category by id
// @route   GET /api/categories/:id
// @access  Public
router.get(
  "/:id",
  existsObjectMiddleware("category", "Категория не найдена"),
  categoryController.show,
);

// @desc    crete category
// @route   POST /api/categories
// @access  Auth, Admin
router.post(
  "/",
  authMiddleware,
  // roleMiddleware("ADMIN"),
  categoryValidation,
  handleValidationErrorsMiddleware,
  categoryController.store,
);

// @desc    update category by id
// @route   PATCH /api/categories/:id
// @access  Auth, Admin
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  existsObjectMiddleware("category", "Категория не найдена"),
  categoryValidation,
  handleValidationErrorsMiddleware,
  categoryController.update,
);

// @desc    delete category by id
// @route   DELETE /api/categories/:id
// @access  Auth, Admin
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  existsObjectMiddleware("category", "Категория не найдена"),
  categoryController.destroy,
);

export default router;
