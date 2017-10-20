const axios = require('axios')
const xml2js = require('xml2js')
const config = require('config')
const ejs = require('ejs')

/**
 * @description 解析xml
 * @param {*} xml 
 */
function parseXML (xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, function (err, obj) {
      if (err) {
        return reject(err)
      }

      resolve(obj)
    })
  })
}

/**
 * 格式化收到的消息
 * @param {*} result 
 */
function formatMessage (result) {
  var message = {}
  if (typeof result === 'object') {
    for (var key in result) {
      if (!(result[key] instanceof Array) || result[key].length === 0) {
        continue
      }
      if (result[key].length === 1) {
        var val = result[key][0]
        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = result[key].map(function (item) {
          return formatMessage(item)
        })
      }
    }
  }
  return message
}

/**
 * 回复消息
 * @param {*} content 
 * @param {*} fromUsername 
 * @param {*} toUsername 
 */
function reply (content, fromUsername, toUsername) {
  var info = {}
  var type = 'text'
  info.content = content || ''
  if (Array.isArray(content)) {
    type = 'news'
  } else if (typeof content === 'object') {
    if (content.hasOwnProperty('type')) {
      if (content.type === 'customerService') {
        return reply2CustomerService(fromUsername, toUsername, content.kfAccount)
      }
      type = content.type
      info.content = content.content
    } else {
      type = 'music'
    }
  }
  info.msgType = type
  info.createTime = new Date().getTime()
  info.toUsername = toUsername
  info.fromUsername = fromUsername
  return compiled(info)
}

const tpl = ['<xml>',
      '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
      '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
      '<CreateTime><%=createTime%></CreateTime>',
      '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
      '<% if (msgType === "news") { %>',
      '<ArticleCount><%=content.length%></ArticleCount>',
      '<Articles>',
      '<% content.forEach(function(item){ %>',
        '<item>',
          '<Title><![CDATA[<%-item.title%>]]></Title>',
          '<Description><![CDATA[<%-item.description%>]]></Description>',
          '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic || item.thumb_url %>]]></PicUrl>',
          '<Url><![CDATA[<%-item.url%>]]></Url>',
        '</item>',
      '<% }) %>',
      '</Articles>',
      '<% } else if (msgType === "music") { %>',
      '<Music>',
        '<Title><![CDATA[<%-content.title%>]]></Title>',
        '<Description><![CDATA[<%-content.description%>]]></Description>',
        '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
        '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
      '</Music>',
      '<% } else if (msgType === "voice") { %>',
      '<Voice>',
        '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '</Voice>',
      '<% } else if (msgType === "image") { %>',
      '<Image>',
        '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '</Image>',
      '<% } else if (msgType === "video") { %>',
      '<Video>',
        '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
        '<Title><![CDATA[<%-content.title%>]]></Title>',
        '<Description><![CDATA[<%-content.description%>]]></Description>',
      '</Video>',
      '<% } else if (msgType === "transfer_customer_service") { %>',
      '<% if (content && content.kfAccount) { %>',
        '<TransInfo>',
          '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
        '</TransInfo>',
      '<% } %>',
      '<% } else { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
      '<% } %>',
      '</xml>'].join('')

const compiled = ejs.compile(tpl)

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
      const message = await parseXML(ctx.request.body)
      const formatedMessage = formatMessage(message.xml)
      const body = await handle(formatedMessage, ctx)
      const replyMessageXml = reply(body, formatedMessage.ToUserName, formatedMessage.FromUserName)
      ctx.body = replyMessageXml
    }
  }
}

module.exports = WechatMessage