const router = require('express').Router()

const Photo = require('../Models/Photo.js')

router.get('/', async (req, res) => {
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

router.get('/list', async (req, res) => {
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

router.get('/random', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset)
    const randomPhotolist = await Photo.aggregate([
      // { $match: { a: 10 } },
      {
        $sample: {
          size: offset
        }
      }
      // {
      //   $lookup: {
      //     from: 'Profile',
      //     localField: 'uploader',
      //     foreignField: '_id',
      //     as: 'uploader'
      //   }
      // }
    ])
    await Photo.populate(randomPhotolist, { path: 'uploader features', select: 'name' })
    res.status(200).json({ randomPhotolist })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
