import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import profileController from "../controllers/profile.controller.js";
import { userUpdateValidation } from "../validators/user.validator.js";
import existsObjectMiddleware from "../middleware/existsObject.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// @desc    get user profile
// @route   GET /api/profile/:id
// @access  Auth, User
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("USER"),
  existsObjectMiddleware("user", "Пользователь не найден"),
  profileController.show,
);

// @desc    update user profile
// @route   PATCH /api/profile/:id
// @access  Auth, User
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("USER"),
  existsObjectMiddleware("user", "Пользователь не найден"),
  userUpdateValidation,
  profileController.update,
);

// @desc    delete user profile
// @route   DELETE /api/profile/:id
// @access  Auth, User
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("USER"),
  existsObjectMiddleware("user", "Пользователь не найден"),
  profileController.destroy,
);

export default router;
