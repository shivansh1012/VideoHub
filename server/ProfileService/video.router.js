const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const Video = require('../Models/Video.js')
const Profile = require('../Models/Profile.js')
const ProfileAuth = require('./profileAuth.js')

const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('./public/uploads/videos/')) {
      fs.mkdirSync('./public/uploads/videos/', { recursive: true })
    }
    cb(null, './public/uploads/videos/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[1] === 'mp4') {
    cb(null, true)
  } else {
    cb(new Error('Not a Valid video File!!'), false)
  }
};

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: multerFilter
}).single('uploadedFile')

router.post('/file', (req, res) => {
  uploadVideo(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.json({ success: false, message: 'A Multer error occurred when uploading.', err }).status(400)
    } else if (err) {
      return res.json({ success: false, message: 'An unknown error occurred when uploading.', err }).status(400)
    }
    const origpath = res.req.file.path.replace(/\\/g, '/')
    let thumbnailfilePath = ''
    let videoDuration = ''
    let width = 0
    let height = 0
    let dimension = []
    let nframes = 0
    let fps = 0
    let thumbnailfilename = ''

    ffmpeg.ffprobe(origpath, function (err, metadata) {
      if (err) {
        return res.json({ success: false, err })
      }
      videoDuration = metadata.format.duration
      nframes = metadata.streams[0].nb_frames
      fps = metadata.streams[0].avg_frame_rate
      width = metadata.streams[0].width
      height = metadata.streams[0].height
      dimension = [width, height]
    })

    ffmpeg(origpath)
      .on('filenames', function (filenames) {
        // console.log('Will generate ' + filenames.join(', '))
        // console.log(filenames)
        thumbnailfilename = filenames[0]
        thumbnailfilePath = 'uploads/thumbnails/' + filenames[0]
      })
      .on('end', filenames => {
        console.log('Screenshots taken')
        console.log(filenames)
        return res.json({
          success: true,
          videopath: origpath,
          videofilename: res.req.file.filename,
          thumbnailfilename,
          thumbnaildir: 'uploads/thumbnails',
          thumbnailpath: thumbnailfilePath,
          videoDuration,
          dimension,
          nframes,
          fps
        })
      })
      .on('error', function (err) {
        console.error(err)
        return res.json({ success: false, err })
      })
      .screenshots({
        count: 1,
        folder: 'public/uploads/thumbnails',
        size: `${width}x${height}`,
        filename: 'thumbnail-%b.png'
      })

    // return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })
})

router.post('/save', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const uploader = id
    let features = []
    for (let i = 0; i < req.body.model.length; i++) {
      features.push(req.body.model[i].value)
    }
    const newVideo = new Video({
      title: req.body.title,
      video: {
        filename: req.body.video.name,
        dir: 'public/uploads/videos/',
        path: 'public/uploads/videos/' + req.body.video.name,
        filetype: path.extname(req.body.video.name).substring(1),
        fps: req.body.video.fps,
        nframes: req.body.video.nframes,
        duration: req.body.video.duration,
        dimension: [req.body.video.dimension[0], req.body.video.dimension[1]]
      },
      thumbnail: {
        filename: req.body.thumbnail.name,
        dir: req.body.thumbnail.dir,
        path: req.body.thumbnail.path
      },
      tags: req.body.title.split(' '),
      uploader: uploader,
      features: features
    })

    const newSavedVideo = await newVideo.save()

    await Profile.findByIdAndUpdate(id, { $push: { 'video.uploads': newSavedVideo._id } })

    for (let i = 0; i < req.body.model.length; i++) {
      await Profile.findByIdAndUpdate(req.body.model[i].value, { $push: { 'video.features': newSavedVideo._id } })
    }

    res.status(200).json({ message: 'Video Saved' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
