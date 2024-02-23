export default (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (token) {
    return res.status(403).json({
      success: false,
      message: "Только не авторизованные пользователи",
    });
  }
  next();
};
