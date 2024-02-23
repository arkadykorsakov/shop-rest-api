import { check } from "express-validator";
import prisma from "../prisma.js";

const commonValidation = [
  check("email").notEmpty().withMessage("Обязательное поле"),
  check("email").isString().withMessage("Введите строку").trim(),
  check("email")
    .isEmail()
    .withMessage("Введите корректный Email")
    .normalizeEmail(),
];

const userValidation = [
  check("name").notEmpty().withMessage("Обязательное поле"),
  check("name").isString().withMessage("Введите строку").trim(),
  check("email").custom(async (value, { req }) => {
    let user = null;
    if (!req.params?.id) {
      user = await prisma.user.findFirst({
        where: { email: value },
      });
    } else {
      user = await prisma.user.findFirst({
        where: { id: { not: +req.params.id }, email: value },
      });
    }
    if (user) {
      return Promise.reject("Пользователь с данным email уже существует");
    }
    return true;
  }),
];

const passwordValidation = [
  check("password").notEmpty().withMessage("Обязательное поле"),
  check("password").isString().withMessage("Введите строку").trim(),
];

export const userStoreValidation = [
  ...commonValidation,
  ...userValidation,
  ...passwordValidation,
];
export const userUpdateValidation = [...commonValidation, userValidation];
export const loginValidation = [...commonValidation, ...passwordValidation];
export const existsPassword = [...passwordValidation];
