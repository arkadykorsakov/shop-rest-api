import prisma from "../prisma.js";
import cartService from "../services/cart.service.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import { check } from "express-validator";

const maxAge = 60 * 60 * 1000 * 24 * 365; // один год
const signed = true;

async function cancelOrRefuse(orderId) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    select: { cart: true },
  });
  const cart = await prisma.cart.findFirst({
    where: { id: order.cart.id },
    select: {
      products: {
        select: {
          productId: true,
          quantity: true,
        },
      },
    },
  });
  for (const product of cart.products) {
    await prisma.product.update({
      where: {
        id: product.productId,
      },
      data: {
        quantity: {
          increment: product.quantity,
        },
      },
    });
  }
}
class OrderController {
  // @desc    making an order
  // @route   POST /api/orders/make
  // @access  Auth, User
  async make(req, res) {
    try {
      const cart = await cartService.findOrCreateCart(req.signedCookies.cartId);
      if (!cart.products.length) {
        return res
          .status(422)
          .json({ success: false, message: "Пустая корзина" });
      }
      const user = await prisma.user.findFirst({ where: { id: +req.user.id } });
      const isPasswordEqual = bcrypt.compareSync(
        req.body.password,
        user.password,
      );
      if (!isPasswordEqual) {
        return res
          .status(401)
          .json({ success: false, message: "Неверный логин или пароль" });
      }
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          cartId: cart.id,
        },
      });
      res.cookie("cartId", "", { maxAge, signed });
      return res.status(200).json({ success: true, order });
    } catch (e) {
      console.log(e);
      errorHandler(res, e.message);
    }
  }

  // @desc    cancel the order
  // @route   POST /api/orders/make
  // @access  Auth, User
  async cancel(req, res) {
    try {
      const orderId = +req.params.id;
      await cancelOrRefuse(orderId);
      const order = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "CANCELLED",
          message: "Клиент отменил от заказ",
        },
      });
      res.status(200).json({ order, success: true });
    } catch (e) {
      errorHandler(res, e.message);
    }
  }

  // @desc    refuse the order
  // @route   POST /api/orders/make
  // @access  Auth, Admin
  async refuse(req, res) {
    try {
      const orderId = +req.params.id;
      await cancelOrRefuse(orderId);
      const order = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "REFUSED",
          message: req.body.message,
        },
      });
      res.status(200).json({ order, success: true });
    } catch (e) {
      errorHandler(res, e.message);
    }
  }

  // @desc    confirm the order
  // @route   POST /api/orders/make
  // @access  Auth, Admin
  async confirm(req, res) {
    try {
      const orderId = +req.params.id;
      const order = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "CONFIRMED",
          message: "Заказ подтвержден",
        },
      });
      res.status(200).json({ order, success: true });
    } catch (e) {
      errorHandler(res, e.message);
    }
  }
}

export default new OrderController();
