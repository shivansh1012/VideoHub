const router = require('express').Router()

const Video = require('../Models/Video.js')

router.get('/search', async (req, res) => {
  try {
    const query = req.query.query

    if (!query) {
      return res.status(400).send('Requires Query')
    }

    const queryOptions = {
      $or: [
        // {
        //   tags: {
        //     $in: [query]
        //   }
        // },
        // {
        //   title: {
        //     $regex: query,
        //     $options: 'i'
        //   }
        // },
        {
          tags: {
            $elemMatch: {
              $regex: query,
              $options: 'i'
            }
          }
        }
      ]
    }

    const resultVideoList = await Video.find(queryOptions).populate('uploader', 'name').populate('features', 'name')
    res.status(200).json({ resultVideoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
