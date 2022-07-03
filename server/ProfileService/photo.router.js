const router = require('express').Router()
const multer = require('multer')
const path = require('path')
var fs = require('fs');

const Profile = require('../Models/Profile.js')
const ProfileAuth = require('./profileAuth.js')

const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

const profilepicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("./public/uploads/profilepics/")) {
      fs.mkdirSync("./public/uploads/profilepics/", { recursive: true });
    }
    cb(null, './public/uploads/profilepics')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const uploadProfilePic = multer({ storage: profilepicStorage }).single('uploadedFile')

router.post('/profilepic', ProfileAuth, async (req, res) => {
  uploadProfilePic(req, res, async err => {
    if (err) {
      return res.json({ success: false, err })
    }
    const { id } = req.userInfo
    const newPath = res.req.file.destination.substring(9) + '/' + res.req.file.filename
    // console.log(res.req)
    await Profile.findByIdAndUpdate(id, { profilepicURL: newPath })
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })
})

module.exports = router
