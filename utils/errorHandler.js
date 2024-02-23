export const errorHandler = (res, message) => {
  res.status(500).json({
    success: false,
    message: message.message ? message.message : message
  })
}
