const bcrypt = require('bcryptjs')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const Video = require('../Models/Video.js')
const Profile = require('../Models/Profile.js')
const Playlist = require('../Models/Playlist.js')
const ProfileAuth = require('./profileAuth.js')

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
      account: 'user',
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
      return res.status(400).json({ message: 'fill all the fields' })
    }

    const existingProfile = await Profile.findOne({ email: email }).select('+password +hashedpassword')
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
      account: existingProfile.account,
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

router.post('/updatepassword', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(401).json({ message: 'fill all the fields' })
    }

    const existingProfile = await Profile.findById(id).select('+password +hashedpassword')

    const isPasswordValid = await bcrypt.compare(currentPassword, existingProfile.hashedpassword)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' })
    }

    const salt = await bcrypt.genSalt()
    const newhashedpassword = await bcrypt.hash(newPassword, salt)

    await Profile.findByIdAndUpdate(id, { password: newPassword, hashedpassword: newhashedpassword })

    return res.status(200)
      .json({ message: 'Password Changed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/userinfo', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const userInfo = await Profile.findById(id)
      .populate({
        path: 'video.uploads video.features video.watchlater video.likes video.dislikes',
        select: 'title thumbnail video uploader',
        populate: {
          path: 'uploader'
        }
      })
      .populate({
        path: 'photo.uploads photo.features photo.likes photo.dislikes',
        select: 'title thumbnail video uploader',
        populate: {
          path: 'uploader'
        }
      })
      .populate({ path: 'playlist', select: 'name byUser playlistpicURL', populate: { path: 'byUser', select: 'name' } })
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
    const userInfo = await Profile.findById(id).populate({ path: 'playlist', select: 'name videoList' })
    let likedStatus
    let watchlaterStatus = false
    if (userInfo.video.likes.includes(mongoose.Types.ObjectId(videoid))) {
      likedStatus = true
    } else if (userInfo.video.dislikes.includes(mongoose.Types.ObjectId(videoid))) {
      likedStatus = false
    }

    if (userInfo.video.watchlater.includes(mongoose.Types.ObjectId(videoid))) {
      watchlaterStatus = true
    }
    const playlist = []
    for (let i = 0; i < userInfo.playlist.length; i++) {
      const tempPlaylist = {
        _id: userInfo.playlist[i]._id,
        name: userInfo.playlist[i].name,
        contains: false
      }
      if (userInfo.playlist[i].videoList.includes(mongoose.Types.ObjectId(videoid))) {
        tempPlaylist.contains = true
      } else {
        tempPlaylist.contains = false
      }
      playlist.push(tempPlaylist)
    }
    res.status(200).json({ likedStatus, watchlaterStatus, playlist })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/updateplaylist', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const { videoid, action, playlistid, newplaylistname } = req.body
    if (action === 'add') {
      await Playlist.findByIdAndUpdate(playlistid, { $push: { videoList: videoid } })
    } else if (action === 'remove') {
      await Playlist.findByIdAndUpdate(playlistid, { $pull: { videoList: videoid } })
    } else {
      const newPlaylist = new Playlist({
        name: newplaylistname,
        byUser: id,
        videoList: [videoid]
      })
      const savedPlaylist = await newPlaylist.save()
      await Profile.findByIdAndUpdate(id, { $push: { playlist: savedPlaylist._id } })
    }
    const updatedplaylist = []
    const userplaylist = (await Profile.findById(id).populate({ path: 'playlist', select: 'name videoList' })).playlist
    for (let i = 0; i < userplaylist.length; i++) {
      const updatedTempPlaylist = {
        _id: userplaylist[i]._id,
        name: userplaylist[i].name,
        contains: false
      }
      if (userplaylist[i].videoList.includes(mongoose.Types.ObjectId(videoid))) {
        updatedTempPlaylist.contains = true
      } else {
        updatedTempPlaylist.contains = false
      }
      updatedplaylist.push(updatedTempPlaylist)
    }
    res.status(200).json({ updatedplaylist })
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
      await Profile.findByIdAndUpdate(id, { $push: { 'video.likes': videoid } })
      await Video.findByIdAndUpdate(videoid, { $push: { likes: id } })
      likedStatus = true
    } else if (action === 'dislike') {
      await Profile.findByIdAndUpdate(id, { $push: { 'video.dislikes': videoid } })
      await Video.findByIdAndUpdate(videoid, { $push: { dislikes: id } })
      likedStatus = false
    } else if (action === 'unlike') {
      await Profile.findByIdAndUpdate(id, { $pull: { 'video.likes': videoid } })
      await Video.findByIdAndUpdate(videoid, { $pull: { likes: id } })
      likedStatus = undefined
    } else if (action === 'undislike') {
      await Profile.findByIdAndUpdate(id, { $pull: { 'video.dislikes': videoid } })
      await Video.findByIdAndUpdate(videoid, { $pull: { dislikes: id } })
      likedStatus = undefined
    } else if (action === 'liketodislike') {
      await Profile.findByIdAndUpdate(id, { $pull: { 'video.likes': videoid }, $push: { 'video.dislikes': videoid } })
      await Video.findByIdAndUpdate(videoid, { $pull: { likes: id }, $push: { dislikes: id } })
      likedStatus = false
    } else if (action === 'disliketolike') {
      await Profile.findByIdAndUpdate(id, { $pull: { 'video.dislikes': videoid }, $push: { 'video.likes': videoid } })
      await Video.findByIdAndUpdate(videoid, { $pull: { dislikes: id }, $push: { likes: id } })
      likedStatus = true
    }
    res.status(200).json({ likedStatus })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/managewatchlater', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const { videoid, action } = req.body
    let updatedstate
    if (action === 'add') {
      await Profile.findByIdAndUpdate(id, { $push: { 'video.watchlater': videoid } })
      updatedstate = true
    } else {
      await Profile.findByIdAndUpdate(id, { $pull: { 'video.watchlater': videoid } })
      updatedstate = false
    }
    res.status(200).json({ updatedstate })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/myvideos', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    const videoList = (await Profile.findById(id).populate({
      path: 'video.uploads',
      populate: {
        path: 'uploader features'
      }
    })).video.uploads
    res.status(200).json({ videoList })
  } catch (e) {
    console.error(e)
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
  const { id, name, account, email } = req.userInfo

  return res.json({
    authorized: true,
    message: 'Success',
    id,
    name,
    account,
    email
  }).status(200)
})

module.exports = router
