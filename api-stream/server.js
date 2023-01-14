const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')

require('./db_init.js')
require('dotenv').config()

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())
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



// Validate DB Connection
const validateDBConn = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(404).json({
      'error': {
        'code': 503,
        'error_ref': 12,
        'message': 'Service Unavailable. Database Connection Failure.'
      }
    })
  }
  next()
}
app.use(validateDBConn)

// Links
app.use('/static', express.static('public'))

app.use('/meta', require('./data-stream/metadata.router.js'))
app.use('/meta/video', require('./data-stream/meta.video.router.js'))
app.use('/meta/photo', require('./data-stream/meta.photo.router.js'))
app.use('/meta/profile', require('./data-stream/meta.profile.router.js'))

app.use('/profile', require('./profile-stream/profile.router.js'))

app.use('/upload/photo', require('./profile-stream/photo.router.js'))
app.use('/upload/video', require('./profile-stream/video.router.js'))

app.use('/stream/photo', require('./file-stream/photo.stream.router.js'))
app.use('/stream/video', require('./file-stream/video.stream.router.js'))

app.use('*', (req, res) =>
  res.status(404).json({
    'error': {
      'code': 404,
      'error_ref': 11,
      'message': 'The resource requested could not be found.'
    }
  })
)

module.exports = app
