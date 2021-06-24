const Joi = require('joi')
const joiOId = require('joi-oid')

const { HttpCode, Subscription } = require('../helpers/constans')
const schemaRegister = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .required(),
})

const schemaUpdate = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .optional(),
  phone: Joi.string()
    .pattern(/[0-9, -+()]/)
    .min(5)
    .max(25)
    .optional(),
  password: Joi.string()
    .optional()

})
const schemaGetById = joiOId.objectId().required()

const changeSubscription = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  subscription: Joi.equal(...Object.values(Subscription))
})

const validate = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
      data: 'Bad Request'
    })
  }
  next()
}

module.exports.register = (req, res, next) => {
  return validate(schemaRegister, req.body, next)
}
module.exports.changeSubscription = (req, res, next) => {
  return validate(changeSubscription, req.body, next)
}

module.exports.login = (req, res, next) => {
  return validate(schemaUpdate, req.body, next)
}

module.exports.logout = (req, res, next) => {
  const { contactId } = req.params
  return validate(schemaGetById, contactId, next)
}
