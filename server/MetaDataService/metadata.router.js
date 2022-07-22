const router = require('express').Router()
const mongoose = require('mongoose')

const Video = require('../Models/Video.js')
const Profile = require('../Models/Profile.js')
const Photo = require('../Models/Photo.js')

router.get('/video', async (req, res) => {
  try {
    const videoID = req.query.id
    if (!videoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }
    const videoData = await Video.findById(req.query.id)
      .populate({
        path: 'uploader',
        select: 'name'
      })
      .populate({
        path: 'features',
        select: 'name'
      })
    res.status(200).json({ videoData })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/photo', async (req, res) => {
  try {
    const photoID = req.query.id
    if (!photoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }
    const photoData = await Photo.findById(req.query.id)
      .populate({
        path: 'uploader',
        select: 'name'
      })
      .populate({
        path: 'features',
        select: 'name'
      })
    res.status(200).json({ photoData })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/profile', async (req, res) => {
  try {
    const profileID = req.query.id
    if (!profileID) {
      return res.status(400).json({ message: 'Requires Profile ID' })
    }
    const profileData = await Profile.findById(profileID)
      .select('name account email profilepicURL playlist video photo')
      .populate({
        path: 'video.uploads video.features video.watchlater video.likes video.dislikes',
        select: 'title thumbnail video uploader'
      })
      .populate({
        path: 'photo.uploads photo.features photo.likes photo.dislikes',
        select: 'title thumbnail video uploader'
      })

    res.status(200).json({ profileData })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/list/video', async (req, res) => {
  try {
    const limit = req.query.limit
    const offset = req.query.offset
    const sort = req.query.sort
    const videoList = await Video.find().sort(sort).skip(offset)
      .limit(limit).populate('uploader', 'name').populate('features', 'name')

    res.status(200).json({ videoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/list/photo', async (req, res) => {
  try {
    const limit = req.query.limit
    const offset = req.query.offset
    const sort = req.query.sort
    const photoList = await Photo.find().sort(sort).skip(offset)
      .limit(limit).populate('uploader', 'name').populate('features', 'name')

    res.status(200).json({ photoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/list/profiles', async (req, res) => {
  try {
    const limit = req.query.limit
    const offset = req.query.offset
    const account = req.query.account
    const profileList = await Profile.find({ account: { $regex: account, $options: 'i' } }).skip(offset)
      .limit(limit).select('name video photo')

    res.status(200).json({ profileList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/search', async (req, res) => {
  try {
    const query = req.query.query

    if (!query) {
      return res.status(400).send('Requires Query')
    }

    const queryOptions = {
      $and: [{
        title: {
          $regex: query,
          $options: 'i'
        }
      }]
    }

    const resultVideoList = await Video.find(queryOptions).populate('uploader', 'name').populate('features', 'name')
    res.status(200).json({ resultVideoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/morevideo', async (req, res) => {
  try {
    const videoID = req.query.id
    const limit = req.query.limit
    const offset = req.query.offset
    if (offset >= 20) {
      return res.status(200).json({ moreVideos: [] })
    }
    if (!videoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }
    const videoData = await Video.findById(req.query.id)
    const moreVideos = await Video.find({ tags: { $in: videoData.tags }, _id: { $ne: mongoose.Types.ObjectId(videoID) } }).skip(offset)
      .limit(limit)
      .populate({
        path: 'uploader',
        select: 'name'
      })
      .populate({
        path: 'features',
        select: 'name'
      })
    res.status(200).json({ moreVideos })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
