const router = require('express').Router()
const mongoose = require('mongoose')

const Video = require('../Models/Video.js')

router.get('/', async (req, res) => {
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

router.get('/list', async (req, res) => {
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

router.get('/more', async (req, res) => {
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

router.get('/random', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset)
    const randomVideolist = await Video.aggregate([
      // { $match: { a: 10 } },
      {
        $sample: {
          size: offset
        }
      },
      // {
      //   $lookup: {
      //     from: 'Profile',
      //     localField: 'uploader',
      //     foreignField: '_id',
      //     as: 'uploader'
      //   }
      // }
    ])
    await Video.populate(randomVideolist, { path: 'uploader' })
    res.status(200).json({ randomVideolist })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
