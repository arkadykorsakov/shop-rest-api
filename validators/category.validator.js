import { check } from "express-validator";
import prisma from "../prisma.js";

const categoryValidation = [
  check("name").notEmpty().withMessage("Обязательное поле"),
  check("name").isString().withMessage("Введите строку").trim(),
  check("name").custom(async (value, { req }) => {
    let category = null;
    if (!req.params?.id) {
      category = await prisma.category.findFirst({
        where: { name: value },
      });
    } else {
      category = await prisma.category.findFirst({
        where: { id: { not: +req.params.id }, name: value },
      });
    }
    if (category) {
      return Promise.reject("Данное значение уже существует");
    }
    return true;
  }),
];

export default categoryValidation;
