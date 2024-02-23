import { validationResult } from 'express-validator'
import removeImage from '../utils/removeImage.js'
export default (req, res, next) => {
  const errorsValidation = validationResult(req)
  if (!errorsValidation.isEmpty()) {
    try {
      if (req.file) {
        removeImage(req.file.path)
      }
    } catch (e) {}
    return res.status(422).json({
      success: false,
      message: 'Невалидные данные',
      error: {
        [errorsValidation.errors[0].path]: errorsValidation.errors[0].msg
      }
    })
  }
  next()
}
