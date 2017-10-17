const Koa = require('koa')
const log = require('./utils/log')
const errorHandle = require('./middlewares/error')
require('./models')

const WechatApi = require('./utils/wechatApi')
const Api = new WechatApi().instance

const app = new Koa()

app.context.log = log

app.use(errorHandle())

app.use(async ctx => {
  const openid = 'old9juDyPzWd7zsc0Y8u1LBpKwu8'
  const template_id = 'X-Loztc_4ig02BdpBFzhUpiEI5ax6dq_kPqLquHLcVE'
  const data = await Api.sendTemplateMessage({}, openid, template_id)
  ctx.body = data
})

module.exports = app