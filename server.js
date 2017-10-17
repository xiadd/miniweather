require('dotenv').config()
const app = require('./src/app')

const PORT = process.env.PORT || 5000


app.listen(PORT, function () {
  console.log('server is running')
})