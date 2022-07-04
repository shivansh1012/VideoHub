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
        path: 'channel',
        select: 'name'
      })
      .populate({
        path: 'model',
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
        path: 'model',
        select: 'name'
      })
    res.status(200).json({ photoData })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/model', async (req, res) => {
  try {
    const modelID = req.query.id
    if (!modelID) {
      return res.status(400).json({ message: 'Requires Model ID' })
    }
    const modelData = await Profile.findById(modelID)
      .select('name videoList profilepicURL')
      .populate({
        path: 'videoList',
        select: 'title thumbnail video model'
      })

    res.status(200).json({ modelData })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/channel', async (req, res) => {
  try {
    const channelID = req.query.id
    if (!channelID) {
      return res.status(400).json({ message: 'Requires Channel ID' })
    }
    const channelData = await Profile.findById(channelID)
    .select('name videoList profilepicURL')
    .populate({
      path: 'videoList',
      select: 'title thumbnail video model'
    })

    res.status(200).json({ channelData })
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
      .limit(limit).populate('channel', 'name').populate('model', 'name')

    res.status(200).json({ videoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/list/profiles', async (req, res) => {
  try {
    const limit = req.query.limit
    const offset = req.query.offset
    const accountType = req.query.accountType
    const profileList = await Profile.find({ accountType: accountType }).skip(offset)
      .limit(limit).select('name videoList')

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

    const resultVideoList = await Video.find(queryOptions).populate('channel', 'name').populate('model', 'name')
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
    if (offset >= 40) {
      return res.status(200).json({ moreVideos: [] })
    }
    if (!videoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }
    const videoData = await Video.findById(req.query.id)
    const moreVideos = await Video.find({ tags: { $in: videoData.tags }, _id: { $ne: mongoose.Types.ObjectId(videoID) } }).skip(offset)
      .limit(limit)
      .populate({
        path: 'channel',
        select: 'name'
      })
      .populate({
        path: 'model',
        select: 'name'
      })
    res.status(200).json({ moreVideos })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
