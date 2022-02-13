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
    required: true
  },
  hashedpassword: {
    type: String,
    required: true
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
  playlist: {
    type: Map,
    of: new mongoose.Schema({
      name: String,
      videoList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Video',
        default: []
      }
    }),
    default: {
      likedvideos: {
        name: 'likedvideos',
        videoList: []
      },
      dislikedvideos: {
        name: 'dislikedvideos',
        videoList: []
      },
      watchlater: {
        name: 'watchlater',
        videoList: []
      }
    }
  }
})

const Profile = mongoose.model('Profile', ProfileSchema, 'Profile')

module.exports = Profile
