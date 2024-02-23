import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import orderController from "../controllers/order.controller.js";
import { existsPassword } from "../validators/user.validator.js";
import handleValidationErrorsMiddleware from "../middleware/handleValidationErrors.middleware.js";
import { orderValidation } from "../validators/order.validator.js";

const router = express.Router();

router.post(
  "/make",
  authMiddleware,
  roleMiddleware("USER"),
  existsPassword,
  handleValidationErrorsMiddleware,
  orderController.make,
);

router.post(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("USER"),
  orderController.cancel,
);

router.post(
  "/:id/refuse",
  authMiddleware,
  // roleMiddleware("ADMIN"),
  orderValidation,
  handleValidationErrorsMiddleware,
  orderController.refuse,
);

router.post(
  "/:id/confirm",
  authMiddleware,
  // roleMiddleware("ADMIN"),
  orderController.confirm,
);

export default router;
