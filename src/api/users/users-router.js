const express = require('express')
const usersControllers = require('../../controllers/users-controllers')
const userValidation = require('../../validation/user-validation')
const { guard } = require('../../helpers/guard')

const usersRouter = express.Router()
usersRouter
  .patch('/', guard, userValidation.changeSubscription, usersControllers.changeSubscription)
  .get('/current', usersControllers.currentUser)
  .post('/auth/register', userValidation.register, usersControllers.register)
  .post('/auth/login', userValidation.login, usersControllers.login)
  .post('/auth/logout', guard, usersControllers.logout)

module.exports = { usersRouter }
