const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const router = require('./router')

const log = require('./utils/log')
const errorHandle = require('./middlewares/error')

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false
};

require('./models')

const app = new Koa()

app.context.log = log
app.keys = ['xiadd']

app.use(session(CONFIG, app))

app.use(bodyParser({
  enableTypes: ['text'],
  extendTypes: {
    text: ['text/xml'],
  }
}))
app.use(errorHandle())

app.use(router.routes()).use(router.allowedMethods())

module.exports = app