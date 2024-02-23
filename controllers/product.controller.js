import { errorHandler } from "../utils/errorHandler.js";
import removeImage from "../utils/removeImage.js";
import prisma from "../prisma.js";

const productFields = {
  id: true,
  name: true,
  price: true,
  quantity: true,
  imgUrl: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
};

class ProductController {
  // @desc    get all products
  // @route   GET /api/products
  // @access  Public
  async index(req, res) {
    try {
      const products = await prisma.product.findMany();
      return res.status(200).json({ products, success: true });
    } catch (e) {
      errorHandler(res, e);
    }
  }

  // @desc    get product by id
  // @route   GET /api/products/:id
  // @access  Public
  async show(req, res) {
    try {
      const product = await prisma.product.findFirst({
        where: { id: +req.params.id },
        select: productFields,
      });
      return res.status(200).json({ product, success: true });
    } catch (e) {
      errorHandler(res, e);
    }
  }

  // @desc    create product
  // @route   POST /api/products
  // @access  Auth, Admin
  async store(req, res) {
    try {
      const { name, price, quantity, categoryId } = req.body;
      const product = await prisma.product.create({
        data: {
          name,
          price,
          quantity: +quantity,
          categoryId: +categoryId,
          imgUrl: req.file ? req.file.path : "",
        },
        select: productFields,
      });
      return res.status(201).json({ product, success: true });
    } catch (e) {
      errorHandler(res, e);
    }
  }

  // @desc    update product by id
  // @route   PATCH /api/products/:id
  // @access  Auth, Admin
  async update(req, res) {
    const { name, price, quantity, categoryId } = req.body;
    try {
      const product = await prisma.product.findFirst({
        where: { id: +req.params.id },
      });
      const updated = {
        name,
        price,
        quantity: +quantity,
        categoryId: +categoryId,
      };
      if (req.file) {
        removeImage(product.imgUrl);
        updated.imgUrl = req.file.path;
      }
      const updatedProduct = await prisma.product.update({
        where: { id: +req.params.id },
        data: { ...updated },
        select: productFields,
      });
      return res.status(200).json({ product: updatedProduct, success: true });
    } catch (e) {
      errorHandler(res, e);
    }
  }

  // @desc    delete product by id
  // @route   DELETE /api/products/:id
  // @access  Auth, Admin
  async destroy(req, res) {
    try {
      await prisma.product
        .findFirst({ where: { id: +req.params.id } })
        .then((product) => removeImage(product.imgUrl));
      await prisma.product.delete({ where: { id: +req.params.id } });
      return res.status(200).json({ success: true, message: "Продукт удален" });
    } catch (e) {
      errorHandler(res, e);
    }
  }
}

export default new ProductController();
