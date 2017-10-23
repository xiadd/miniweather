const Router = require('koa-router')
const config = require('config')

const WechatApi = require('./libs/wechatApi')
const WechatAuth = require('./libs/wechatAuth')
const WechatMessage = require('./libs/wechatMessage')
const genetrateSignature = require('./utils/getSign')
const auth = require('./middlewares/auth')

const Auth = new WechatAuth().instance
const Api = new WechatApi().instance
const Message = new WechatMessage().instance

const UserController = require('./controllers/user')
const WeatherController = require('./controllers/weather')


const router = new Router()

// 授权登录
router.get('/auth', UserController.login)

// 验证权限问题
router.use(auth())

router.get('/wechat', async ctx => {
  
})

router.post('/wechat', Message.message())

// 获取天气情况
router.get('/weather', WeatherController.getWeather)

module.exports = router