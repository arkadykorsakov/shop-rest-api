import { errorHandler } from "../utils/errorHandler.js";
import prisma from "../prisma.js";
import cartService from "../services/cart.service.js";
import bcrypt from "bcryptjs";

const maxAge = 60 * 60 * 1000 * 24 * 365; // один год
const signed = true;

class CartController {
  // @desc    get cart by cartId (cookies)
  // @route   POST /api/cart/add/:productId/:quantity
  // @access  Auth, User
  async getCart(req, res) {
    try {
      const cart = await cartService.findOrCreateCart(req.signedCookies.cartId);
      res.cookie("cartId", cart.id, { maxAge, signed });
      return res.status(200).json({ success: true, cart: cart });
    } catch (e) {
      errorHandler(res, e.message);
    }
  }

  // @desc    add product in cart
  // @route   POST /api/cart/add/:productId/:quantity
  // @access  Auth, User
  async addProduct(req, res) {
    try {
      const cart = await cartService.findOrCreateCart(req.signedCookies.cartId);
      const { productId, quantity } = req.params;
      const cartProduct = await cartService.findProductInCart({
        cartId: cart.id,
        productId: +productId,
      });
      if (cartProduct) {
        if (cartProduct.product.quantity > quantity) {
          await prisma.cartProduct.update({
            where: {
              id: cartProduct.id,
              cartId: cart.id,
              productId: +productId,
            },
            data: {
              quantity: cartProduct.quantity + +quantity,
              product: {
                update: {
                  quantity: {
                    decrement: +quantity,
                  },
                },
              },
            },
          });
        } else {
          return res
            .status(400)
            .json({ success: true, message: "Добавить больше нельзя" });
        }
      } else {
        await prisma.cartProduct.create({
          data: {
            cartId: cart.id,
            productId: +productId,
            quantity: +quantity,
          },
        });
        await prisma.product.update({
          where: { id: +productId },
          data: { quantity: { decrement: +quantity } },
        });
      }
      const updatedCart = await cartService.findOrCreateCart(cart.id);
      res.cookie("cartId", updatedCart.id, { maxAge, signed });
      return res.status(200).json({ success: true, cart: updatedCart });
    } catch (e) {
      errorHandler(res, e);
    }
  }

  // @desc    remove product in cart
  // @route   POST /api/cart/remove/:productId/:quantity
  // @access  Auth, User
  async removeProduct(req, res) {
    try {
      const cart = await cartService.findOrCreateCart(req.signedCookies.cartId);
      const { productId, quantity } = req.params;
      const cartProduct = await cartService.findProductInCart({
        cartId: cart.id,
        productId: +productId,
      });
      if (cartProduct) {
        console.log(cartProduct.product.quantity);
        if (cartProduct.quantity > 1) {
          await prisma.cartProduct.update({
            where: { cartId: cart.id, productId: +productId },
            data: {
              quantity: cartProduct.quantity - +quantity,
              product: {
                update: {
                  quantity: { increment: +quantity },
                },
              },
            },
          });
        } else {
          await prisma.cartProduct.delete({
            where: { cartId: cart.id, productId: +productId },
          });
          await prisma.product.update({
            where: { id: +productId },

            data: { quantity: { increment: +quantity } },
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "Нельзя удалить товар, которого нет в корзине",
        });
      }
      const updatedCart = await cartService.findOrCreateCart(cart.id);
      res.cookie("cartId", updatedCart.id, { maxAge, signed });
      return res.status(200).json({ success: true, cart: updatedCart });
    } catch (e) {
      errorHandler(res, e);
    }
  }

  // @desc    clear cart
  // @route   POST /api/cart/clear
  // @access  Auth, User
  async clearCart(req, res) {
    try {
      const cart = await cartService.findOrCreateCart(req.signedCookies.cartId);
      if (cart.products.length) {
        for (const cartProduct of cart.products) {
          await prisma.product.update({
            where: { id: cartProduct.product.id },
            data: {
              quantity: { increment: cartProduct.quantity },
            },
          });
        }
      }
      await prisma.cartProduct.deleteMany({
        where: { cartId: cart.id },
      });
      const updatedCart = await cartService.findOrCreateCart(cart.id);
      res.cookie("cartId", updatedCart.id, { maxAge, signed });
      return res
        .status(200)
        .json({ success: true, cart: updatedCart, message: "Корзина очищена" });
    } catch (e) {
      errorHandler(res, e);
    }
  }
}

export default new CartController();
