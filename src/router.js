const Router = require('koa-router')
const config = require('config')

const WechatApi = require('./libs/wechatApi')
const WechatAuth = require('./libs/wechatAuth')
const genetrateSignature = require('./utils/getSign')

const Auth = new WechatAuth().instance
const Api = new WechatApi().instance

const router = new Router()

router.get('/wechat', async ctx => {
  const { signature, timestamp, nonce, echostr } = ctx.query
  const token = config.get('token')
  if (genetrateSignature(signature, timestamp, nonce, token)) {
    ctx.body =  echostr
  } else {
    ctx.body = false
  }
})

router.post('/wechat', ctx => {
  console.log(ctx.request.body)
  ctx.body = 'success'
})

router.get('/auth', async ctx => {
  const code = ctx.query.code
  const data = await Auth.getAccessToken(code)
  const userinfo = await Auth.getUserinfo(data.access_token, data.openid)
  ctx.body = userinfo
})

module.exports = router