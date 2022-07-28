const router = require('express').Router()

const Profile = require('../Models/Profile.js')

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
