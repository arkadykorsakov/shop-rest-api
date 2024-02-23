import tokenService from "../services/token.service.js";
export default (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Не авторизован" });
    }
    const decodedToken = tokenService.validateAccess(token);
    if (!decodedToken || !decodedToken.id) {
      return res
        .status(403)
        .json({ message: "Невалидный токен", success: false });
    }
    req.user = { ...decodedToken };
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Не авторизован" });
  }
};
