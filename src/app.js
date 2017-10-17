const Koa = require('koa')
const log = require('./utils/log')
const errorHandle = require('./middlewares/error')
require('./models')

const app = new Koa()

app.context.log = log

app.use(errorHandle())

module.exports = app