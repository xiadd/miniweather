const axios = require('axios')
const config = require('config')

/**
 * @description 这是微信消息类 主要封装了一些对话操作
 * 
 * @class WechatMessage
 */
class WechatMessage {
  constructor () {}

  get instance () {
    return new WechatMessage()
  }

  /**
   * @public
   * @param {*} handle 
   */
  message (handle) {
    return async (ctx, next) => {
      const body = await handle(message, ctx)
    }
  }
}

module.exports = WechatMessage