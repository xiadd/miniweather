const log4js = require('log4js')

log4js.configure({
  appenders: {
    file: {
      type: 'dateFile',
      filename: 'logs/error.log',
      pattern: "-yyyy-MM-dd",
    },
    stdout: {
      type: 'stdout'
    }
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'error'
    }
  }
})

const logger = log4js.getLogger('app')

module.exports = logger