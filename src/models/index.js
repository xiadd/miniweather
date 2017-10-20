const mongoose = require('mongoose')
const config = require('config')

mongoose.Promise = global.Promise

mongoose.connect(config.get('db.url'), {
  useMongoClient: true
})

const User = require('./user')

module.exports = {
  User
}