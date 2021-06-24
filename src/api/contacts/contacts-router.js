const express = require('express')
const contactsControllers = require('../../controllers/contacts-controllers')
const contactValidation = require('../../validation/contact-validation')
const { guard } = require('../../helpers/guard')

const contactsRouter = express.Router()
contactsRouter
  .get('/', guard, contactsControllers.listContacts)
  .get('/:contactId', guard, contactValidation.contatctId, contactsControllers.getContactById)
  .post('/', guard, contactValidation.create, contactsControllers.addContact)
  .patch('/:contactId', guard, contactValidation.update, contactsControllers.updateContact)
  .delete('/:contactId', guard, contactValidation.contatctId, contactsControllers.removeContact)

module.exports = { contactsRouter }
