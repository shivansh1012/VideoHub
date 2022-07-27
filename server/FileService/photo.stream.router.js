const router = require('express').Router()
const fs = require('fs')

const Photo = require('../Models/Photo.js')

router.get('/', async (req, res) => {
  try {
    const photoID = req.query.id
    if (!photoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }
    const photoData = await Photo.findById(req.query.id)
    fs.createReadStream(photoData.path).pipe(res)

    // res.sendFile(photoData.path)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
