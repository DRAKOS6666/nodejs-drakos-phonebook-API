const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema, SchemaTypes, model } = mongoose

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [2, 'Min length name is 2 signs'],
    maxLength: [75, 'Max length name is 75 signs'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    minLength: [6, 'Minimal length 6 signs'],
    maxLength: [20, 'Maximum length 20 signs']

  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user'
  }
}, { versionKey: false, timestamps: true })

contactSchema.plugin(mongoosePaginate)

const ContactsSchema = model('contact', contactSchema)

module.exports = ContactsSchema
