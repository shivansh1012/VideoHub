const router = require('express').Router()
const fs = require('fs')

const Photo = require('../Models/Photo.js')

router.get('/', async (req, res, next) => {
  try {
    const photoID = req.query.id
    if (!photoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }

    const photoData = await Photo.findById(req.query.id)

    var options = {
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        'content-type': photoData.ext
      }
    }

    res.sendFile(photoData.path, options, function (err) {
      if (err) {
        next(err)
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
