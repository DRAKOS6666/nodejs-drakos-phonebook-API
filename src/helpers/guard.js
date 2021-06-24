const passport = require('passport')
require('../../config/passport')
const { HttpCode } = require('./constans')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    let token = null
    if (req.get('Authorization')) {
      const [, tokenPure] = req.get('Authorization').split(' ')
      token = tokenPure
    }
    if (!user || error || token !== user.token) {
      return res.status(HttpCode.FORBIDDEN).json({
        status: 'error',
        code: HttpCode.FORBIDDEN,
        data: 'Forbidden',
        message: 'Access is denied',
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = {
  guard,
}
