const router = require('express').Router()

const Video = require('../Models/Video.js')
const Profile = require('../Models/Profile.js')

router.get('/video', async (req, res) => {
  try {
    const videoID = req.query.id
    if (!videoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }
    const videoData = await Video.findById(req.query.id)
      .populate({ path: 'channel', populate: { path: 'videoList', populate: { path: 'channel model' } } })
      .populate({ path: 'model', populate: { path: 'videoList', populate: { path: 'channel model' } } })

    const moreChannelVideos = new Set()
    const moreModelVideos = new Set()

    if (videoData.channel) {
      // videoData.channel.videoList.forEach(moreChannelVideos.add, moreChannelVideos)
      for (let i = 0; i < videoData.channel.videoList.length; i++) {
        if (videoData.channel.videoList[i]._id.toString() === videoID) {
          continue
        }
        moreChannelVideos.add(videoData.channel.videoList[i])
      }
    }
    if (videoData.model.length !== 0) {
      for (let i = 0; i < videoData.model.length; i++) {
        for (let j = 0; j < videoData.model[i].videoList.length; j++) {
          if (videoData.model[i].videoList[j]._id.toString() === videoID) {
            continue
          }
          moreModelVideos.add(videoData.model[i].videoList[j])
        }
        // videoData.model[i].videoList.forEach(moreModelVideos.add, moreModelVideos)
      }
    }
    let moreVideos = []
    if (moreChannelVideos.size > moreModelVideos.size) {
      moreVideos = Array.from(moreChannelVideos)
    } else {
      moreVideos = Array.from(moreModelVideos)
    }
    res.status(200).json({ videoData, moreVideos })
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
    const videoList = await Video.find().skip(offset)
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
        title: {
          $regex: query,
          $options: 'i'
        }
      }]
    }

    // const queryOptions = {
    //   tags: query
    // }

    const resultVideoList = await Video.find(queryOptions).populate('channel', 'name').populate('model')
    res.status(200).json({ resultVideoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
