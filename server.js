require('dotenv').config()
const app = require('./src/app')

const PORT = 8080


app.listen(PORT, function () {
  console.log('server is running')
})