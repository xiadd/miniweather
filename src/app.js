const Koa = require('koa')
const log = require('./utils/log')
const errorHandle = require('./middlewares/error')

const app = new Koa()

app.context.log = log

app.use(errorHandle())

app.use(ctx => {
  throw new Error('123')
})

app.on('error', function (error, ctx) {
  
})

module.exports = app