const express = require('express')

const { HttpCode } = require('./helpers/constans')
const { contactsRouter } = require('./api/contacts/contacts-router')
const { usersRouter } = require('./api/users/users-router')

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res, next) => {
  res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: `Use api on routes ${req.baseUrl}/api/contacts`,
    data: 'Not Found'
  })
})

app.use((err, req, res, next) => {
  err.status = err.status ? err.status : HttpCode.INTERNAL_SERVER_ERROR
  res.status(HttpCode.NOT_FOUND).json({
    status: err.status === 500 ? 'fail' : 'error',
    code: err.status,
    message: err.message,
    data: err.status === 500 ? 'Internal Server Error' : err.data,
  })
})

module.exports = app
