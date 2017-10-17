// 微信公众平台主动调用接口

const axios = require('axios')
const config = require('config')
const redis = require('redis')
const client = redis.createClient()

class WechatApi {
  constructor (appid, appsecret) {
    this.appid = appid
    this.appsecret = appsecret
  }

  /**
   * 
   * @description 实例化微信公众平台对象 主动获取
   * @readonly
   * @memberof WechatApi
   */
  get instance () {
    return new WechatApi(config.get('appid'), config.get('appsecret'))
  }

  /**
   * 
   * @description 获取access_token 作为主动调用接口的基础
   * @returns {Promise} 返回access_token
   * @memberof WechatApi
   */

  getAccessToken () {
    const url = 'https://api.weixin.qq.com/cgi-bin/token'
    return new Promise((resove, reject) => {
      client.get('access_token', async (err, token) => {
        if (err) reject(err)
        if (token) resolve(token)
        const response = await axios.get(url, {
          params: {
            grant_type: 'client_credential',
            appid: this.appid,
            secret: this.appsecret
          }
        })
        // access_token 7200秒失效 这里过期时间设置为7000秒
        client.set('access_token', response.data.access_token, 'EX', 7000)
        return resolve(response.data.access_token)    
      })
    })
  }

  /**
   * 
   * 
   * @param {object} menu 
   * @memberof WechatApi
   */
  async setCustomeMenu (menu,) {
    const url = 'https://api.weixin.qq.com/cgi-bin/menu/create'
    const access_token = await this.getAccessToken()
    const response = await axios.get(url, menu, {
      params: {
        access_token: access_token
      }
    })
    return response.data
  }

  
  /**
   * 
   * 
   * @returns {Promise}
   * @memberof WechatApi
   */
  async getCustomeMenu () {
    const url = 'https://api.weixin.qq.com/cgi-bin/menu/get'
    const access_token = await this.getAccessToken()
    const response = await axios.get(url, {
      params: {
        access_token: access_token
      }
    })
    return response.data
  }

}

module.exports = WechatApi