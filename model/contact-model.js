const { Subscription } = require('../src/helpers/constans')
const ContactSchema = require('./schema/contacts-schema')

const listContacts = async (userId, query) => {
  const { limit = 20, offset = 0, page = 1, sortBy, sortByDesc, sub } = query
  const options = {
    owner: userId,
    subscription: sub || { $in: [...Object.values(Subscription)] },
  }
  const { docs: contacts, totalDocs: total } = await ContactSchema.paginate(options, {
    page,
    limit,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    populate: {
      path: 'owner',
      select: 'username email subscription -_id'
    },
  })
  return { contacts, total, limit, offset }
}

const getContactById = async ({ contactId }, userId) => {
  const result = await ContactSchema.findOne({ _id: contactId, owner: userId }).populate({
    path: 'owner',
    select: 'username email subscription -_id'
  })
  return result
}

const removeContact = async ({ contactId }, userId) => {
  const result = await ContactSchema.findByIdAndDelete({ _id: contactId, owner: userId })
  return result
}

const addContact = async (body, userId) => {
  const result = await ContactSchema.create({ ...body, owner: userId })
  return result
}

const updateContact = async ({ contactId }, body, userId) => {
  const result = await ContactSchema.findByIdAndUpdate({ _id: contactId, owner: userId },
    { ...body },
    { new: true })
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
