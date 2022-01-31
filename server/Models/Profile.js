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
    default: ''
  },
  videoList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'VideoMetaData',
    default: []
  }
})

const Profile = mongoose.model('Profile', ProfileSchema, 'Profile')

module.exports = Profile
