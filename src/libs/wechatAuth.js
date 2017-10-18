const config = require('config')
const axios = require('axios')
const qs = require('querystring')

/**
 * @description 这里主要是微信网页开发授权部分操作
 * 
 * @class WechatAuth
 */
class WechatAuth {
  constructor (appid, appsecret) {
    this.accessTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token'
    this.appid = appid
    this.appsecret = appsecret
  }

  get instance () {
    return new WechatAuth(config.get('appid'), config.get('appsecret'))
  }
  
  /**
   * @description 获取授权链接 注意请传入scope[snsapi_base, snsapi_userinfo ]
   * @TODO: 这里state需要实现
   * @readonly
   * @memberof WechatAuth
   */
  getAuthorizationUrl (scope) {
    const redirect_url = encodeURIComponent(config.get('authorize_redirect_url'))
    const baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize' 
    const params = {
      appid: this.appid,
      redirect_uri: redirect_url,
      response_type: 'code',
      scope: scope,
      state: '123'
    }

    return `${baseUrl}?${qs.stringify(params)}#wechat_redirect`
  }

  /**
   * @description 授权后获取access_token 注意这里的access_token 跟主动调用的access_token是不同的
   * 首先主动调用的access_token 是有次数限制的 这里的没有(所有这里就不做缓存了)
   * 
   * @param {any} code 
   * @returns 
   * @memberof WechatAuth
   */
  async getAccessToken (code) {
    const url = this.accessTokenUrl
    const response = await axios.get(url, {
      params: {
        appid: this.appid,
        secret: this.appsecret,
        code: code,
        grant_type: 'authorization_code'
      }
    })

    return response.data
  }

  /**
   * @description 当scope为snsapi_userinfo时 可以获取用户信息
   * 
   * @param {string} access_token 
   * @param {string} openid 
   * @memberof WechatAuth
   */
  async getUserinfo (access_token, openid) {
    const url = 'https://api.weixin.qq.com/sns/userinfo'
    const response = await axios.get(url, {
      params: {
        access_token: access_token,
        openid: openid,
        lang: 'zh_CN'
      }
    })
    return response.data
  }

  /**
   * @description 验证access_token是否有效
   * 
   * @param {any} access_token 
   * @param {string} openid
   * @memberof WechatAuth
   */
  async validateAccessToken(access_token, openid) {
    const url = 'https://api.weixin.qq.com/sns/auth'
    const response = await axios.get(url, {
      params: {
        openid: openid,
        access_token: access_token
      }
    })

    return response.data
  }
}


module.exports = WechatAuth