import prisma from '../prisma.js'
import { errorHandler } from '../utils/errorHandler.js'
import removeImage from '../utils/removeImage.js'

const categoryFields = {
  id: true,
  name: true
}

class CategoryController {
  // @desc    get all categories
  // @route   GET /api/categories
  // @access  Public
  async index(req, res) {
    try {
      const categories = await prisma.category.findMany({
        select: categoryFields
      })
      return res.status(200).json({ categories, success: true })
    } catch (e) {
      errorHandler(res, e)
    }
  }

  // @desc    get category by id
  // @route   GET /api/controller/:id
  // @access  Public
  async show(req, res) {
    try {
      const category = await prisma.category.findFirst({
        where: { id: +req.params.id },
        select: categoryFields
      })
      return res.status(200).json({ category, success: true })
    } catch (e) {
      errorHandler(res, e)
    }
  }

  // @desc    crete category
  // @route   POST /api/categories
  // @access  Auth, Admin
  async store(req, res) {
    try {
      const { name } = req.body
      const category = await prisma.category.create({
        data: { name },
        select: categoryFields
      })
      return res.status(201).json({ category, success: true })
    } catch (e) {
      errorHandler(res, e)
    }
  }

  // @desc    update category by id
  // @route   PATCH /api/categories/:id
  // @access  Auth, Admin
  async update(req, res) {
    try {
      const { name } = req.body
      const updatedCategory = await prisma.category.update({
        where: { id: +req.params.id },
        data: {
          name
        },
        select: categoryFields
      })
      return res.status(200).json({ category: updatedCategory, success: true })
    } catch (e) {
      errorHandler(res, e)
    }
  }

  // @desc    delete category by id
  // @route   DELETE /api/categories/:id
  // @access  Auth, Admin
  async destroy(req, res) {
    try {
      const products = await prisma.product.findMany({
        where: { categoryId: +req.params.id }
      })
      for (const product of products) {
        removeImage(product.imgUrl)
      }
      await prisma.category.delete({
        where: { id: +req.params.id }
      })
      return res
        .status(200)
        .json({ success: true, message: 'Категория удалена' })
    } catch (e) {
      errorHandler(res, e)
    }
  }
}
export default new CategoryController()
