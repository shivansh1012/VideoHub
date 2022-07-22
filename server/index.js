const mongoose = require('mongoose')
const app = require('./server.js')

const PORT = process.env.PORT || 5000

console.log('Connecting to DB...')

mongoose.connect(process.env.MERN_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) return console.log(err)
  console.log('LOCAL DB connection Success')
  app.listen(PORT, () => console.log(`Server running on PORT : ${PORT}`))
})
