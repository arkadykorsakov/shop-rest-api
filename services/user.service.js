import bcrypt from "bcryptjs";
import prisma from "../prisma.js";

const userFields = {
  id: true,
  name: true,
  email: true,
  role: true,
};
class UserService {
  // @desc create user
  async store(data) {
    try {
      const { email, password, name } = data;
      const salt = bcrypt.genSaltSync(10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: bcrypt.hashSync(password, salt),
        },
        select: userFields,
      });
      return { ...user };
    } catch (e) {
      throw e;
    }
  }

  // @desc get user by id
  async show(id) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id,
        },
        select: userFields,
      });
      return { ...user };
    } catch (e) {
      throw e;
    }
  }

  // @desc update user by id
  async update(id, data) {
    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data,
        select: userFields,
      });
      return { ...user };
    } catch (e) {
      throw e;
    }
  }

  // @desc delete user by id
  async destroy(id) {
    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });
      return null;
    } catch (e) {
      throw e;
    }
  }
}

export default new UserService();
