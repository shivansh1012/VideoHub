const mongoose = require('mongoose')

const PhotoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  dir: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  ext: {
    type: String,
    required: true
  },
  dimension: {
    type: [Number],
    required: true
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

const Photo = mongoose.model('Photo', PhotoSchema, 'Photo')

module.exports = Photo
