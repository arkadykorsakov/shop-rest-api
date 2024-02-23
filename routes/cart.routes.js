import express from "express";
import existsObjectMiddleware from "../middleware/existsObject.middleware.js";
import cartController from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// @desc    get cart by cartId (cookies)
// @route   POST /api/cart/add/:productId/:quantity
// @access  Auth, User
router.get("/", authMiddleware, roleMiddleware("USER"), cartController.getCart);

// @desc    add product in cart
// @route   POST /api/cart/add/:productId/:quantity
// @access  Auth, User
router.post(
  "/add/:productId/:quantity",
  authMiddleware,
  roleMiddleware("USER"),
  existsObjectMiddleware("product", "Продукт не найден", "productId"),
  cartController.addProduct,
);

// @desc    remove product in cart
// @route   POST /api/cart/remove/:productId/:quantity
// @access  Auth, User
router.post(
  "/remove/:productId/:quantity",
  authMiddleware,
  roleMiddleware("USER"),
  existsObjectMiddleware("product", "Продукт не найден", "productId"),
  cartController.removeProduct,
);

// @desc    clear cart
// @route   POST /api/cart/clear
// @access  Auth, User
router.post(
  "/clear",
  authMiddleware,
  roleMiddleware("USER"),
  cartController.clearCart,
);

export default router;
