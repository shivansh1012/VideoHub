const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  video: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  thumbnail: {
    type: Map,
    of: String
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: ''
  },
  features: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Profile',
    default: []
  },
  tags: {
    type: Array,
    default: []
  },
  uploaddate: {
    type: Number,
    default: Date.now()
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Profile',
    default: []
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Profile',
    default: []
  }
})

const Video = mongoose.model('Video', VideoSchema, 'Video')

module.exports = Video
