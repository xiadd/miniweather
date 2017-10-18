const Router = require('koa-router')

const WechatApi = require('./libs/wechatApi')
const WechatAuth = require('./libs/wechatAuth')

const Auth = new WechatAuth().instance
const Api = new WechatApi().instance

const router = new Router()

router.get('/wechat', async ctx => {
  ctx.body = 'xiadd'
})

router.get('/auth', async ctx => {
  const code = ctx.query.code
  const data = await Auth.getAccessToken(code)
  const userinfo = await Auth.getUserinfo(data.access_token, data.openid)
  ctx.body = userinfo
})

module.exports = router