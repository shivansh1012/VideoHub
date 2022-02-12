const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  video: {
    type: Map,
    of: String
  },
  thumbnail: {
    type: Map,
    of: String
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  },
  tags: {
    type: Array,
    default: [String]
  },
  model: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Profile',
    default: []
  },
  uploaddate: {
    type: Number,
    default: Date.now()
  },
  likedusers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Profile',
    default: []
  },
  dislikedusers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Profile',
    default: []
  }
})

const Video = mongoose.model('Video', VideoSchema, 'Video')

module.exports = Video
