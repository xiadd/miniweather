const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./router')

const log = require('./utils/log')
const errorHandle = require('./middlewares/error')

require('./models')

const app = new Koa()

app.context.log = log

app.use(bodyParser({
  enableTypes: ['text'],
  extendTypes: {
    text: ['text/xml'],
  }
}))
app.use(errorHandle())

app.use(router.routes()).use(router.allowedMethods())

module.exports = app