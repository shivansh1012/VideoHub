const mongoose = require('mongoose')

const VideoMetaDataSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalfilename: {
    type: String,
    default: ''
  },
  dir: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: 'Unknown'
  },
  tags: {
    type: Array,
    default: []
  },
  model: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Profile',
    default: []
  },
  fps: {
    type: String,
    required: true
  },
  nframes: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  dimensions: {
    type: Array,
    default: []
  }
})

const VideoMetaData = mongoose.model('VideoMetaData', VideoMetaDataSchema, 'VideoMetaData')

module.exports = VideoMetaData
