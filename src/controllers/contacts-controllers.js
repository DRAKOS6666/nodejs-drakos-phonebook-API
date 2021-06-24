const { HttpCode } = require('../helpers/constans')
const contactModel = require('../../model/contact-model')

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contacts = await contactModel.listContacts(userId, req.query)
    res.status(HttpCode.OK).json({
      status: 'succes',
      code: HttpCode.OK,
      data: {
        ...contacts,
      }
    })
  } catch (e) {
    next(e)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await contactModel.getContactById(req.params, userId)
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'succes',
        code: HttpCode.OK,
        data: {
          contact,
        }
      })
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'Contact is not found',
        data: 'Not Found'
      })
    }
  } catch (e) {
    next(e)
  }
}

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await contactModel.addContact(req.body, userId)
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'succes',
        code: HttpCode.CREATED,
        data: {
          contact,
        }
      })
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'Contact is not found',
        data: 'Not Found'
      })
    }
  } catch (e) {
    next(e)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { name, email, phone } = req.body
    if (name || email || phone) {
      const contact = await contactModel.updateContact(req.params, req.body, userId)
      if (contact) {
        return res.status(HttpCode.OK).json({
          status: 'succes',
          code: HttpCode.CREATED,
          data: {
            contact,
          }
        })
      } else {
        return next({
          status: HttpCode.NOT_FOUND,
          message: 'Not found',
          data: 'Not Found'
        })
      }
    } next()
  } catch (e) {
    next(e)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await contactModel.removeContact(req.params, userId)
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'succes',
        code: HttpCode.OR,
        message: "contact deleted"
      })
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'Not found',
        data: 'Not Found'
      })
    }
  } catch (e) {
    next(e)
  }
}

module.exports = {
  listContacts, getContactById, addContact, updateContact, removeContact
}
