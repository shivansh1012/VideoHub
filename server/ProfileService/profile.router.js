const bcrypt = require('bcryptjs')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')

const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path

const Video = require('../Models/Video.js')
const Profile = require('../Models/Profile.js')
const ProfileAuth = require('./profileAuth.js')

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/videos')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.mp4') {
      // return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false)
      return cb(null, false)
    }
    cb(null, true)
  }
})

const profilepicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/profilepics')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const uploadVideo = multer({ storage: videoStorage }).single('uploadedFile')

const uploadProfilePic = multer({ storage: profilepicStorage }).single('uploadedFile')

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'fill all the fields' })
    }

    const existingProfile = await Profile.findOne({ email: email })

    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' })
    }

    const salt = await bcrypt.genSalt()
    const hashedpassword = await bcrypt.hash(password, salt)

    const newProfile = new Profile({
      name: name,
      email: email,
      accountType: 'user',
      password: password,
      hashedpassword: hashedpassword
    })

    await newProfile.save()

    res.status(200).json({ message: 'Account Creation Success' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(401).json({ message: 'fill all the fields' })
    }

    const existingProfile = await Profile.findOne({ email: email })
    if (!existingProfile) {
      return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    if (!existingProfile.hashedpassword) {
      const salt = await bcrypt.genSalt()
      const hashedpassword = await bcrypt.hash(existingProfile.password, salt)
      existingProfile.hashedpassword = hashedpassword
      await Profile.findOneAndUpdate({ email }, { hashedpassword })
    }

    const isPasswordValid = await bcrypt.compare(password, existingProfile.hashedpassword)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const userToken = jwt.sign({
      id: existingProfile._id,
      name: existingProfile.name,
      accountType: existingProfile.accountType,
      email: existingProfile.email
    }, process.env.JWT_SECRET)
    return res.status(200)
      .cookie('UserToken', userToken, { httpOnly: true })
      .json({ message: 'Login Success' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/userinfo', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const userInfo = await Profile.findById(id)
      .populate({ path: 'videoList', populate: { path: 'model channel', select: 'name' } })
      .select('-password -hashedpassword')
    res.status(200).json({ userInfo })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/userstatus', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const videoid = req.query.videoid
    const userInfo = await Profile.findById(id)
    let likedStatus
    let watchlaterStatus = false
    if (userInfo.playlist.get('likedvideos').videoList.includes(mongoose.Types.ObjectId(videoid))) {
      likedStatus = true
    } else if (userInfo.playlist.get('dislikedvideos').videoList.includes(mongoose.Types.ObjectId(videoid))) {
      likedStatus = false
    }

    if (userInfo.playlist.get('watchlater').videoList.includes(mongoose.Types.ObjectId(videoid))) {
      watchlaterStatus = true
    }

    res.status(200).json({ likedStatus, watchlaterStatus })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/updateplaylist', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const { videoid, action, playlistname } = req.body
    let updatedstate
    if (action === 'add') {
      await Profile.findByIdAndUpdate(id, { $push: { [`playlist.${playlistname}.videoList`]: videoid } })
      updatedstate = true
      // } else if (action === 'remove') {
    } else {
      await Profile.findByIdAndUpdate(id, { $pull: { [`playlist.${playlistname}.videoList`]: videoid } })
      updatedstate = false
    }
    // } else {
    //   await Profile.findByIdAndUpdate(id, { playlist: { name: playlistname, {}} })
    //   updatedstate = true
    res.status(200).json({ updatedstate })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/managelike', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const { videoid, action } = req.body
    let likedStatus
    if (action === 'like') {
      await Profile.findByIdAndUpdate(id, { $push: { 'playlist.likedvideos.videoList': videoid } })
      await Video.findByIdAndUpdate(videoid, { $push: { likedusers: id } })
      likedStatus = true
    } else if (action === 'dislike') {
      await Profile.findByIdAndUpdate(id, { $push: { 'playlist.dislikedvideos.videoList': videoid } })
      await Video.findByIdAndUpdate(videoid, { $push: { dislikedusers: id } })
      likedStatus = false
    } else if (action === 'unlike') {
      await Profile.findByIdAndUpdate(id, { $pull: { 'playlist.likedvideos.videoList': videoid } })
      await Video.findByIdAndUpdate(videoid, { $pull: { likedusers: id } })
      likedStatus = undefined
    } else if (action === 'undislike') {
      await Profile.findByIdAndUpdate(id, { $pull: { 'playlist.dislikedvideos.videoList': videoid } })
      await Video.findByIdAndUpdate(videoid, { $pull: { dislikedusers: id } })
      likedStatus = undefined
    } else if (action === 'liketodislike') {
      await Profile.findByIdAndUpdate(id, { $pull: { 'playlist.likedvideos.videoList': videoid }, $push: { 'playlist.dislikedvideos.videoList': videoid } })
      await Video.findByIdAndUpdate(videoid, { $pull: { likedusers: id }, $push: { dislikedusers: id } })
      likedStatus = false
    } else if (action === 'disliketolike') {
      await Profile.findByIdAndUpdate(id, { $pull: { 'playlist.dislikedvideos.videoList': videoid }, $push: { 'playlist.likedvideos.videoList': videoid } })
      await Video.findByIdAndUpdate(videoid, { $pull: { dislikedusers: id }, $push: { likedusers: id } })
      likedStatus = true
    }
    res.status(200).json({ likedStatus })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/myvideos', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const videoList = (await Profile.findById(id).populate({ path: 'videoList', populate: { path: 'model channel', select: 'name' } })).videoList
    res.status(200).json({ videoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/upload/profilepic', ProfileAuth, async (req, res) => {
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

router.post('/upload/video', (req, res) => {
  uploadVideo(req, res, err => {
    if (err) {
      return res.json({ success: false, err })
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })
})

router.post('/thumbnail', async (req, res) => {
  const origpath = req.body.filePath.replace(/\\/g, '/')

  let thumbnailfilePath = ''
  let videoDuration = ''
  let width = 0
  let height = 0
  let dimension = []
  let nframes = 0
  let fps = 0
  let thumbnailfilename = ''

  await ffmpeg.ffprobe(origpath, function (err, metadata) {
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
})

router.post('/newvideo', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const {
      title,
      videofileName,
      thumbnailfileName,
      thumbnaildir,
      thumbnailpath,
      fps,
      nframes,
      duration,
      dimension
    } = req.body

    const newVideo = new Video({
      title,
      video: {
        filename: videofileName,
        dir: '',
        path: '',
        fps,
        nframes,
        duration,
        dimension: dimension[0] + 'x' + dimension[1]
      },
      thumbnail: {
        filename: thumbnailfileName,
        dir: thumbnaildir,
        path: thumbnailpath
      },
      tags: title.split(' '),
      model: [id]
    })

    const newSavedVideo = await newVideo.save()

    await Profile.findByIdAndUpdate(id, { $push: { videoList: newSavedVideo._id } })

    res.status(200).json({ message: 'Video Saved' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/logout', (req, res) => {
  res.cookie('UserToken', '', {
    httpOnly: true,
    expires: new Date(0)
  }).send()
})

router.get('/verify', ProfileAuth, (req, res) => {
  const { id, name, accountType, email } = req.userInfo

  return res.json({
    authorized: true,
    message: 'Success',
    id,
    name,
    accountType,
    email
  }).status(200)
})

module.exports = router
