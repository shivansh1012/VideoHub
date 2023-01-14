const mongoose = require('mongoose')

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  byUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  playlistpicURL: {
    type: String,
    default: 'defaults/playlistdefaultpic.png'
  },
  videoList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Video',
    default: []
  }
})

const Playlist = mongoose.model('Playlist', PlaylistSchema, 'Playlist')

module.exports = Playlist
