const UserSchema = require('./schema/users-schema')

const findByEmail = async (email) => {
  return await UserSchema.findOne({ email })
}

const findById = async (id) => {
  return await UserSchema.findOne({ _id: id })
}

const create = async ({ username, email, password, subscription }) => {
  const user = new UserSchema({ username, email, password, subscription })
  return await user.save()
}

const updateToken = async (id, token) => {
  return await UserSchema.updateOne({ _id: id }, { token })
}

const changeSubsc = async (id, subscription) => {
  return await UserSchema.updateOne({ _id: id }, { subscription })
}

module.exports = {
  findByEmail,
  findById,
  updateToken,
  create,
  changeSubsc
}
