module.exports = (ctx) => {
  if (ctx.method === 'get') {
    return async function (ctx, next) {
      const { signature, timestamp, nonce, echostr } = ctx.query
      const token = config.get('token')
      if (genetrateSignature(signature, timestamp, nonce, token)) {
        ctx.body =  echostr
      } else {
        ctx.body = false
      }
    }
  } else if (ctx.method === 'post') {
    return Message.message(async function (message, ctx) {
      return {
        content: message.Content,
        type: 'text'
      }
    })
  }
}