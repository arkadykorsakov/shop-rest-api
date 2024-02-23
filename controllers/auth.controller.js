import { errorHandler } from '../utils/errorHandler.js'
import userService from '../services/user.service.js'
import tokenService from '../services/token.service.js'
import bcrypt from 'bcryptjs'
import prisma from '../prisma.js'

async function generateAndSaveToken(user) {
  try {
    const token = tokenService.generate({
      id: user.id,
      role: user.role
    })
    await tokenService.save(user.id, token.refreshToken)
    return { ...token }
  } catch (e) {
    throw e
  }
}

function isTokenInvalid(data, dbToken) {
  return !data || !dbToken || Number(data.id) !== Number(dbToken?.userId)
}

class AuthController {
  // @desc    register user
  // @route   POST /api/auth/register
  // @access  Public, NotAuth
  async register(req, res) {
    try {
      const user = await userService.store(req.body)
      const token = await generateAndSaveToken(user)
      return res.status(201).json({ user, token, success: true })
    } catch (e) {
      errorHandler(res, e)
    }
  }

  // @desc    log in profile
  // @route   POST /api/auth/login
  // @access  Public, NotAuth
  async login(req, res) {
    try {
      const candidate = await prisma.user.findFirst({
        where: { email: req.body.email }
      })
      if (!candidate) {
        return res
          .status(401)
          .json({ success: false, message: 'Неверный логин или пароль' })
      }
      const isPasswordEqual = bcrypt.compareSync(
        req.body.password,
        candidate.password
      )
      if (!isPasswordEqual) {
        return res
          .status(401)
          .json({ success: false, message: 'Неверный логин или пароль' })
      }
      const token = await generateAndSaveToken(candidate)
      return res.status(200).json({ user: candidate, token, success: true })
    } catch (e) {
      errorHandler(res, e)
    }
  }

  // @desc    log out profile
  // @route   POST /api/auth/logout
  // @access  Public, Auth
  async logout(req, res) {
    try {
      await tokenService.deleteToken(req.user.id)
      return res
        .status(200)
        .json({ message: 'Выход из системы', success: true })
    } catch (e) {
      errorHandler(res, e)
    }
  }

  async refreshToken(req, res) {
    try {
      const data = tokenService.validateRefresh(req.body.refresh_token)
      const dbToken = await tokenService.findToken(req.body.refresh_token)
      if (isTokenInvalid(data, dbToken)) {
        return res
          .status(403)
          .json({ message: 'Невалидный токен', success: false })
      }
      const tokens = await generateAndSaveToken(data)
      await tokenService.save(data.id, tokens.refreshToken)
      res.status(200).json({ ...tokens })
    } catch (e) {
      errorHandler(res, e)
    }
  }
}

export default new AuthController()
