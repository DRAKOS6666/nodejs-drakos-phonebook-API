const mongoose = require('mongoose')

require('dotenv').config()

const uriDb = process.env.URI_DB

const db = mongoose.connect(uriDb, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
})

mongoose.connection.on('connected', () => {
  console.log(`Database connection successful`)
})

mongoose.connection.on('error', (error) => {
  console.log(`Mongoose connection error: ${error.message}`)
})

mongoose.connection.on('disconnected', () => {
  console.log(`Mongoose disconnected`)
})
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('DataBase disconnected and app is terminated')
    process.exit(1)
  })
})

module.exports = db
