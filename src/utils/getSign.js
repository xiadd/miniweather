const crypto = require('crypto')

/**
 * @description 验证签名是否相等
 * @param {*} signature 
 * @param {*} params 
 */
function genetrateSignature (signature, ...params) {
  const sorted = params.sort().join('')
  const shasum = crypto.createHash('sha1')
  shasum.update(sorted)
  const str = shasum.digest('hex')
  return str === signature ? true : false
}

module.exports = genetrateSignature