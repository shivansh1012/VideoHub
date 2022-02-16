const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    default: 'user'
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  hashedpassword: {
    type: String,
    required: true,
    select: false
  },
  profilepicURL: {
    type: String,
    default: 'defaults/defaultprofilepic.png'
  },
  videoList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Video',
    default: []
  },
  likedvideos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Video',
    default: []
  },
  dislikedvideos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Video',
    default: []
  },
  watchlater: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Video',
    default: []
  },
  playlist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Playlist',
    default: []
  }
})

const Profile = mongoose.model('Profile', ProfileSchema, 'Profile')

module.exports = Profile
