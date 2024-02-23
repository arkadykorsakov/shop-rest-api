import { check } from "express-validator";

export const orderValidation = [
  check("message").notEmpty().withMessage("Обязательное поле"),
];
