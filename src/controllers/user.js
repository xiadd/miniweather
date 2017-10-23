const User = require('../services/user')
const WechatAuth = require('../libs/wechatAuth')

const Auth = new WechatAuth().instance

module.exports = {
  /**
   * 用户登录 and 注册 由于这里是oauth 且不提供自身的用户系血色,就这么将就吧
   * @param {*} ctx 
   * @param {*} next 
   */
  async login (ctx, next) {
    const code = ctx.query.code
    const data = await Auth.getAccessToken(code)
    const userinfo = await Auth.getUserinfo(data.access_token, data.openid)
    ctx.session.user = userinfo
    if (await User.getUserByOpenid(data.openid)) {
      const user = await User.update(data.openid, userinfo)
      ctx.body = user
    } else {
      const user = await User.create(userinfo)
      ctx.body = user
    }
  }
}