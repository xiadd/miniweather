module.exports = function (ctx, next) {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.log.error(err)
      ctx.app.emit('error', err, ctx)
    }
  }
}