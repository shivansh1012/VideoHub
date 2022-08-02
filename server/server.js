const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

require('dotenv').config()

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())

// cors
app.use(cors({
  origin: true,
  credentials: true
}))

// logging middleware
const requestLogger = (req, res, next) => {
  const method = req.method
  const url = req.url
  const log = `${method}:${url}`
  console.log(log)
  next()
}

app.use(requestLogger)

// Links
app.use('/', express.static('./public/build'))

app.use('/static', express.static('public'))

app.use('/meta', require('./MetaDataService/metadata.router.js'))
app.use('/meta/video', require('./MetaDataService/meta.video.router.js'))
app.use('/meta/photo', require('./MetaDataService/meta.photo.router.js'))
app.use('/meta/profile', require('./MetaDataService/meta.profile.router.js'))

app.use('/profile', require('./ProfileService/profile.router.js'))

app.use('/upload/photo', require('./ProfileService/photo.router.js'))
app.use('/upload/video', require('./ProfileService/video.router.js'))

app.use('/stream/photo', require('./FileService/photo.stream.router.js'))
app.use('/stream/video', require('./FileService/video.stream.router.js'))

app.use('*', (req, res) => res.status(404).json({ message: 'link not found' }))

module.exports = app
