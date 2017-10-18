const Koa = require('koa')
const router = require('./router')

const log = require('./utils/log')
const errorHandle = require('./middlewares/error')
require('./models')

const app = new Koa()

app.context.log = log

app.use(errorHandle())

app.use(router.routes()).use(router.allowedMethods())

module.exports = app