export default (type) => {
  return (req, res, next) => {
    if (req.user?.role !== type) {
      return res.status(403).json({
        success: false,
        message: "У вас недостаточно прав совершать данное действие",
      });
    }
    next();
  };
};
