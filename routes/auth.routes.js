import express from "express";
import authController from "../controllers/auth.controller.js";
import {
  userStoreValidation,
  loginValidation,
} from "../validators/user.validator.js";
import handleValidationErrorsMiddleware from "../middleware/handleValidationErrors.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import notAuthMiddleware from "../middleware/notAuth.middleware.js";

const router = express.Router();

// @desc    register user
// @route   POST /api/auth/register
// @access  Public, NotAuth
router.post(
  "/register",
  notAuthMiddleware,
  userStoreValidation,
  handleValidationErrorsMiddleware,
  authController.register,
);

// @desc   log in profile
// @route   POST /api/auth/login
// @access  Public, NotAuth
router.post(
  "/login",
  notAuthMiddleware,
  loginValidation,
  handleValidationErrorsMiddleware,
  authController.login,
);

// @desc   log out profile
// @route   POST /api/auth/logout
// @access  Public, Auth
router.post("/logout", authMiddleware, authController.logout);

// @desc   refresh token
// @route   POST /api/auth/refresh-token
// @access  Public, Auth
router.post("/refresh-token", authController.refreshToken);
export default router;
