const mongoose = require('mongoose')
const bCrypt = require('bcryptjs')
const { Subscription: { FREE, PRO, PREMIUM } } = require('../../src/helpers/constans')

const saltFactor = process.env.SALT_WORK_FACTOR

const { Schema, model } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  subscription: {
    type: String,
    enum: [FREE, PRO, PREMIUM],
    default: FREE
  },
  token: {
    type: String,
    default: null
  }
}, { versionKey: false, timestamps: true })

// userSchema.methods.setPassword = function (password) {
//   this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(saltFactor))
// }
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bCrypt.genSalt(saltFactor)
  this.password = await bCrypt.hash(this.password, salt, null)
  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bCrypt.compare(password, this.password)
}

userSchema.path('email').validate(function (value) {
  const re = /\S+@\S+\.\S+/
  return re.test(String(value).toLowerCase())
})

const UserSchema = model('user', userSchema)

module.exports = UserSchema
