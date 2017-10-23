module.exports = function () {
  return async function (ctx, next) {
    if (ctx.session.user) {
      await next()
    } else {
      ctx.body = 'User does not login yet'
    }
  }
}