const router = require('express').Router()
const fs = require('fs')

const Video = require('../Models/Video.js')
const Photo = require('../Models/Photo.js')

router.get('/video', async (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range
  const videoID = req.query.id

  if (!range) {
    return res.status(400).json({ message: 'Requires Range header' })
  }

  if (!videoID) {
    return res.status(400).json({ message: 'Requires Video ID' })
  }

  const tempVideoData = await Video.findById(req.query.id)
  if (!tempVideoData) {
    return res.status(400).json({ message: 'Invalid Video ID' })
  }
  let videoPath = tempVideoData.video.get("path")

  // get video stats (about 61MB)
  const videoSize = fs.statSync(videoPath).size

  // Parse Range
  // Example: 'bytes=32324-'
  const CHUNK_SIZE = 10 ** 6 // 1MB
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

  // Create headers
  const contentLength = end - start + 1
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4'
  }

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers)

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end })

  // Stream the video chunk to the client
  videoStream.pipe(res)
})

router.get('/photo', async (req, res) => {
  try {
    const photoID = req.query.id
    if (!photoID) {
      return res.status(400).json({ message: 'Requires Video ID' })
    }

    const photoData = await Photo.findById(req.query.id)

    res.sendFile(photoData.path)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
