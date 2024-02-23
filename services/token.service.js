import jwt from "jsonwebtoken";
import config from "config";
import prisma from "../prisma.js";
const ACCESS_SECRET = config.get("ACCESS_SECRET");
const REFRESH_SECRET = config.get("REFRESH_SECRET");

class TokenService {
  // @desc generate token
  generate(payload) {
    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET);
    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  // @desc save token
  async save(userId, refreshToken) {
    try {
      const data = await prisma.token.findFirst({ where: { userId } });
      if (data) {
        data.refreshToken = refreshToken;
        const updatedData = await prisma.token.update({
          where: { userId },
          data: { refreshToken },
        });
        return { ...updatedData };
      }
      const token = await prisma.token.create({
        data: { refreshToken, userId },
      });
      return { ...token };
    } catch (e) {
      throw e;
    }
  }

  // @desc check valid refresh token
  validateRefresh(refreshToken) {
    try {
      return jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (e) {
      return null;
    }
  }

  // @desc check valid access token
  validateAccess(accessToken) {
    try {
      return jwt.verify(accessToken, ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  // @desc find token by refreshToken

  async findToken(refreshToken) {
    try {
      return await prisma.token.findFirst({ where: { refreshToken } });
    } catch (e) {
      return null;
    }
  }

  // @desc delete token
  async deleteToken(userId) {
    try {
      return await prisma.token.delete({ where: { userId } });
    } catch (e) {}
  }
}

export default new TokenService();
