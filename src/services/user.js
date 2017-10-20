const { User } = require('../models')

module.exports = {
  /**
   * 用户注册
   * @param {*} info 
   */
  async create (info) {
    const user = new User(info)
    return user.save()
  },

  /**
   * 用户更新
   * @param {*} info 
   */
  async update (openid, info) {
    const user = await User.findOneAndUpdate({ openid: openid }, info)
    return user
  },

  /**
   * 根据openid获取用户
   * @param {*} id 
   */
   async getUserByOpenid (openid) {
     return User.findUserByOpenid(openid)
   },

   /**
    * 根据id获取用户
    * @param {*} id 
    */
   async getUserById(id) {
     return User.findById(id)
   }
}