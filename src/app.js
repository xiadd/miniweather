const Koa = require('koa')
const log = require('./utils/log')
const errorHandle = require('./middlewares/error')
require('./models')

const WechatApi = require('./utils/wechatApi')
const Api = new WechatApi().instance

const app = new Koa()

app.context.log = log

app.use(errorHandle())


module.exports = app