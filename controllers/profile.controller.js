import { errorHandler } from "../utils/errorHandler.js";
import userService from "../services/user.service.js";

const checkIsRules = (req, res) => {
  if (Number(req.user.id) !== Number(req.params.id)) {
    res.status(403).json({ success: false, message: "Не ваш аккаунт" });
    return false;
  }
  return true;
};
class ProfileController {
  // @desc    get user profile
  // @route   GET /api/profile/:id
  // @access  Public, Auth
  async show(req, res) {
    try {
      const isRules = checkIsRules(req, res);
      if (!isRules) return;
      const user = await userService.show(+req.params.id);
      return res.status(200).json({ success: true, user });
    } catch (e) {
      errorHandler(res, e);
    }
  }

  // @desc    update user profile
  // @route   PATCH /api/profile/:id
  // @access  Public, Auth
  async update(req, res) {
    try {
      const isRules = checkIsRules(req, res);
      if (!isRules) return;
      const updateUser = await userService.update(+req.params.id, req.body);
      res.status(200).json({ success: true, user: updateUser });
    } catch (e) {
      errorHandler(res, e);
    }
  }

  // @desc    delete user profile
  // @route   DELETE /api/profile/:id
  // @access  Public, Auth
  async destroy(req, res) {
    try {
      const isRules = checkIsRules(req, res);
      if (!isRules) return;
      await userService.destroy(+req.params.id);
      res.status(200).json({ message: "Пользователь удален", success: true });
    } catch (e) {
      errorHandler(res, e);
    }
  }
}

export default new ProfileController();
