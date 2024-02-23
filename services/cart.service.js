import prisma from "../prisma.js";

class CartService {
  async findOrCreateCart(cartId) {
    try {
      let cart;
      if (cartId) {
        cart = await prisma.cart.findFirst({
          where: { id: +cartId },
          select: {
            id: true,
            products: {
              select: {
                product: true,
                quantity: true,
              },
            },
          },
        });
      } else {
        cart = await prisma.cart.create({
          data: {},
          select: {
            id: true,
            products: true,
          },
        });
      }
      return cart;
    } catch (e) {
      throw e;
    }
  }

  async findProductInCart({ cartId, productId }) {
    const cartProduct = await prisma.cartProduct.findFirst({
      where: { cartId, productId: +productId },
      select: {
        id: true,
        quantity: true,
        product: { select: { quantity: true } },
      },
    });

    return cartProduct ? { ...cartProduct } : null;
  }
}
export default new CartService();
