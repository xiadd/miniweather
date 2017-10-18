const redis = require('redis')
const client = redis.createClient()

const log = require('./log')

client.on('error', function (err) {
  log.error(err)
})

const _redis = {}

_redis.set = client.set.bind(client)

_redis.get = async function (key) {
  return new Promise((resolve, reject) => {
    client.get(key, function (err, value) {
      if (err) return reject(err)
      resolve(value)
    })
  })
}

module.exports = _redis
