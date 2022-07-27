const mongoose = require('mongoose')

const Video = require('./Video.js')
const Photo = require('./Photo.js')

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  account: {
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
  playlist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Playlist',
    default: []
  },
  // video: {
  //   type: Map,
  //   of: [{type:mongoose.Schema.Types.ObjectId, ref: Video}],
  //   default: {
  //     'uploads' : [],
  //     'features' : [],
  //     'likes': [],
  //     'dislikes': [],
  //     'watchlater': []
  //   }
  // },
  video: {
    uploads: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Video }],
      default: []
    },
    features: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Video }],
      default: []
    },
    watchlater: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Video }],
      default: []
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Video }],
      default: []
    },
    dislikes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Video }],
      default: []
    }
  },
  photo: {
    uploads: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Photo }],
      default: []
    },
    features: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Photo }],
      default: []
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Photo }],
      default: []
    },
    dislikes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: Photo }],
      default: []
    }
  }
})

const Profile = mongoose.model('Profile', ProfileSchema, 'Profile')

module.exports = Profile
