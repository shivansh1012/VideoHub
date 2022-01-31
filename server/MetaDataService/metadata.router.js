const router = require('express').Router()

const VideoMetaData = require('../Models/VideoMetaData.js')
const Profile = require('../Models/Profile.js')

router.get('/video', async (req, res) => {
  try {
    const videoID = req.query.id
    if (!videoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }
    const videoData = await VideoMetaData.findById(req.query.id).populate('channel', 'name').populate('model')

    let moreVideos = []
    if (videoData['channel']) {
      moreVideos = moreVideos.concat((await Profile.findById(videoData.channel._id).populate('videoList')).videoList)
    } else if (videoData.model.length !== 0) {
      for (let i = 0; i < videoData.model.length; i++) {
        let modelVideoList = (await Profile.findById(videoData.model[i]._id).populate('videoList')).videoList
        for (let j = 0; j < modelVideoList.length; j++) {
          moreVideos = moreVideos.concat((await VideoMetaData.findById(modelVideoList[j]._id).populate('channel', 'name').populate('model')))
        }
      }
    }
    res.status(200).json({ videoData, moreVideos: Array.from(moreVideos) })
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
    const modelData = await Profile.findById(modelID).populate('videoList')

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
    const channelData = await Profile.findById(channelID).populate('videoList')

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
    const videoList = await VideoMetaData.find().skip(offset)
      .limit(limit).populate('channel', 'name').populate('model')

    res.status(200).json({ videoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/list/model', async (req, res) => {
  try {
    const limit = req.query.limit
    const offset = req.query.offset
    const modelList = await Profile.find({ accountType: 'model' }).skip(offset)
      .limit(limit)

    res.status(200).json({ modelList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/list/channel', async (req, res) => {
  try {
    const limit = req.query.limit
    const offset = req.query.offset
    const channelList = await Profile.find({ accountType: 'channel' }).skip(offset)
      .limit(limit)

    res.status(200).json({ channelList })
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
        originalfilename: {
          $regex: query,
          $options: 'i'
        }
      }]
    }

    const resultVideoList = await VideoMetaData.find(queryOptions).populate('channel', 'name').populate('model')
    res.status(200).json({ resultVideoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
