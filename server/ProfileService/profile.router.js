const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const VideoMetaData = require('../Models/VideoMetaData.js')
const Profile = require('../Models/Profile.js')
const ProfileAuth = require('./profileAuth.js')

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'fill all the fields' })
    }

    const existingProfile = await Profile.findOne({ email: email })

    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' })
    }

    const salt = await bcrypt.genSalt()
    const hashedpassword = await bcrypt.hash(password, salt)

    const newProfile = new Profile({
      name: name,
      email: email,
      accountType: 'user',
      password: password,
      hashedpassword: hashedpassword
    })

    await newProfile.save()

    res.status(200).json({ message: 'Account Creation Success' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(401).json({ message: 'fill all the fields' })
    }

    const existingProfile = await Profile.findOne({ email: email })
    if (!existingProfile) {
      return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    if (!existingProfile.hashedpassword) {
      const salt = await bcrypt.genSalt()
      const hashedpassword = await bcrypt.hash(existingProfile.password, salt)
      existingProfile.hashedpassword = hashedpassword
      await Profile.findOneAndUpdate({ email }, { hashedpassword })
    }

    const isPasswordValid = await bcrypt.compare(password, existingProfile.hashedpassword)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const userToken = jwt.sign({
      id: existingProfile._id,
      name: existingProfile.name,
      accountType: existingProfile.accountType,
      email: existingProfile.email
    }, process.env.JWT_SECRET)
    return res.status(200)
      .cookie('UserToken', userToken, { httpOnly: true })
      .json({ message: 'Login Success' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/myvideos', ProfileAuth, async (req, res) => {
  try {
    const { id } = req.userInfo
    // const limit = req.query.limit
    // const offset = req.query.offset
    // const videoList = await Profile.findById(id).skip(offset).limit(limit)
    const videoList = (await Profile.findById(id).populate({ path: 'videoList', populate: { path: 'model channel' } })).videoList
    res.status(200).json({ videoList })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/logout', (req, res) => {
  res.cookie('UserToken', '', {
    httpOnly: true,
    expires: new Date(0)
  }).send()
})

router.get('/verify', ProfileAuth, (req, res) => {
  const { id, name, accountType, email } = req.userInfo

  return res.json({
    authorized: true,
    message: 'Success',
    id,
    name,
    accountType,
    email
  }).status(200)
})

module.exports = router
