const router = require('express').Router()
const mongoose = require('mongoose')

const Profile = require('../Models/Profile.js')
const Video = require('../Models/Video.js')

router.get('/', async (req, res) => {
  try {
    const profileID = req.query.id
    if (!profileID) {
      return res.status(400).json({ message: 'Requires Profile ID' })
    }
    const profileData = await Profile.findById(profileID)
      .select('name account email profilepicURL playlist video photo')
      .populate({
        path: 'video.uploads video.features video.watchlater video.likes video.dislikes',
        select: 'title thumbnail video uploader features',
        populate: {
          path: 'uploader features',
          select: 'name'
        }
      })
      .populate({
        path: 'photo.uploads photo.features photo.likes photo.dislikes',
        select: 'title thumbnail video uploader features',
        populate: {
          path: 'uploader features',
          select: 'name'
        }
      })

    res.status(200).json({ profileData })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/files', async (req, res) => {
  try {
    const profileID = req.query.id
    const type = req.query.type
    const list = req.query.list
    let offset = req.query.offset
    let limit = req.query.limit
    console.log(limit)
    if (!profileID) {
      return res.status(400).json({ message: 'Requires Profile ID' })
    }
    if (!offset || offset === "undefined") {
      offset = 0
    }
    if (!limit || limit === "undefined") {
      limit = 50
    }
    const profileData = (await Profile.aggregate(
      [
        {
          $match: {
            "_id": mongoose.Types.ObjectId(profileID)
          }
        },
        {
          $project: {
            outputlist: {
              $slice: [
                `$${list}`, parseInt(offset), parseInt(limit)
              ]
            }
          }
        },
        {
          $lookup: {
            from: type,
            localField: "outputlist",
            foreignField: "_id",
            as: "populatedlist"
          }
        }
      ]
    ))[0]

    await Video.populate(profileData.populatedlist, { path: 'uploader features', select: 'name' })

    res.status(200).json({ list: profileData.populatedlist })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/list', async (req, res) => {
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
module.exports = router
