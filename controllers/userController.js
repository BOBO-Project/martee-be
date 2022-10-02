const { User } = require('../models')

/* HELPERS */
const { verifyPassword, hashPassword, encodeToken, verifyToken } = require('../helpers')

class UserController {
  static async register(req, res, next) {
    try {
      const { email, password, role = 'user' } = req.body

      if (!email || !password) throw { message: "Email or Password must be provided" }

      const payload = {
        email: email.toLowerCase(),
        password: hashPassword(password),
        role
      }

      await User.create(payload)

      return res.status(200).json({
        data: {
          email,
          role
        },
        message: "Successfully create user"
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed create user"
      })
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw { message: "Email or Password must be provided" }

      const user = await User.findOne({
        where: {
          email: email.toLowerCase()
        }
      })

      if (!user) throw { message: "User not found" }

      const isValid = verifyPassword(password, user.password)
      if (!isValid) throw { message: "Invalid email or password" }

      const token = encodeToken({ id: user.id, email: user.email, role: user.role })

      return res.status(200).json({
        access_token: token,
        message: "Successfully login"
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to login"
      })
    }
  }

  static async checkAuth(req, res, next) {
    try {
      const userData = verifyToken(req.headers.authorization);
      let user = await User.findOne({ where: { id: userData.email.id } });
      if (!user) throw { message: "User not authenticated" }

      next()
    } catch (error) {
      return res.status(400).json({
        message: "User not login",
        status_code: 400
      })
    }
  }
}

module.exports = UserController