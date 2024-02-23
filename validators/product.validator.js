import { check } from 'express-validator'
import prisma from '../prisma.js'

const productValidation = [
  check('name').notEmpty().withMessage('Обязательное поле'),
  check('name').isString().withMessage('Введите строку').trim(),
  check('price').notEmpty().withMessage('Обязательное поле'),
  check('price')
    .isFloat({
      min: 0,
      max: 99999999.99
    })
    .withMessage('Введите число в диапозоне от 0 до 99999999.99'),
  check('quantity').notEmpty().withMessage('Обязательное поле'),
  check('quantity')
    .isInt({ min: 0 })
    .withMessage('Введите положительное число'),
  check('image').custom((value, { req }) => {
    if (
      req.file &&
      !['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(
        req.file.mimetype
      )
    )
      return Promise.reject('Только картинки')
    return true
  }),
  check('categoryId').notEmpty().withMessage('Обязательное поле'),
  check('categoryId').isInt().withMessage('Некорректный Id'),
  check('categoryId').custom(async (value) => {
    try {
      const id = +value
      const category = await prisma.category.findFirst({
        where: { id }
      })
      if (!category) return Promise.reject('Такой категории не существует')
      return true
    } catch (e) {
      console.log(e)
    }
  })
]

export const productStoreValidation = [
  check('image').custom((value, { req, path }) => {
    if (!req.file) return Promise.reject('Обязательное поле')
    return true
  }),
  ...productValidation
]

export const productUpdateValidation = [...productValidation]
