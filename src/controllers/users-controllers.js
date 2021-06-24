const jwt = require('jsonwebtoken')
const { HttpCode } = require('../helpers/constans')
const UserModel = require('../../model/user-model')

require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET

const register = async (req, res, next) => {
  try {
    const { email } = await req.body
    const user = await UserModel.findByEmail(email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        message: 'This email is already used.',
        conde: HttpCode.CONFLICT,
        data: 'Conflict'
      })
    }
    const newUser = await UserModel.create(req.body)
    res.status(HttpCode.CREATED).json({
      status: 'succes',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.Email,
        username: newUser.username,
        subscription: newUser.subscription
      }
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findByEmail(email)
    if (!user || !user.validPassword(password)) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        message: 'Invalid credentials.',
        conde: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized'
      })
    }
    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await UserModel.updateToken(id, token)
    res.status(HttpCode.OK).json({
      status: 'succes',
      code: HttpCode.OK,
      data: {
        token,
      }
    })
  } catch (e) {
    next(e)
  }
}

const changeSubscription = async (req, res, next) => {
  try {
    const { email, subscription } = req.body
    const user = await UserModel.findByEmail(email)
    if (!user) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        message: 'User not found.',
        conde: HttpCode.NOT_FOUND,
        data: 'NOT_FOUND',
      })
    }
    await UserModel.changeSubsc(user.id, subscription)
    return res.status(HttpCode.OK).json({
      status: 'succes',
      code: HttpCode.OK,
      message: `Subscription has changed to '${subscription}'`,
    })
  } catch (e) {
    next(e)
  }
}

const currentUser = async (req, res, next) => {
  const error401 = {
    status: 'error',
    message: 'Not authorized.',
    data: 'Unauthorized'
  }
  try {
    if (!req.get('Authorization')) {
      return next(error401)
    }
    const [, token] = req.get('Authorization').split(' ')
    const verified = jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return next(error401)
      }
      return decoded
    })

    if (!verified || !token) {
      return next()
    }

    const user = await UserModel.findById(verified.id)

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json(error401)
    }
    return res.status(HttpCode.OK).json({
      status: 'succes',
      code: HttpCode.OK,
      data: {
        email: user.email,
        subscription: user.subscription
      }
    })
  } catch (e) {
    next(e)
  }
}

const logout = async (req, res, next) => {
  const userId = req.user.id
  await UserModel.updateToken(userId, null)

  return res.status(HttpCode.NO_CONTENT).json({})
}

module.exports = {
  register, login, logout, currentUser, changeSubscription
}
