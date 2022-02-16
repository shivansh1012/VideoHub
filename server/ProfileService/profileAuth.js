const jwt = require('jsonwebtoken')
const Profile = require('../Models/Profile.js')

async function userAuth (req, res, next) {
  try {
    const userToken = req.cookies.UserToken

    if (!userToken) {
      return res.json({ authorized: false, message: 'Unauthorized' })
    }

    const { id } = jwt.verify(userToken, process.env.JWT_SECRET)

    if ((await Profile.findById(id)) === null) {
      return res.cookie('UserToken', '', {
        httpOnly: true,
        expires: new Date(0)
      }).json({ authorized: false, message: 'Unauthorized' })
    }

    req.userInfo = jwt.verify(userToken, process.env.JWT_SECRET)

    next()
  } catch (err) {
    console.error(err)
    res.json({ authorized: false, message: 'Unauthorized' })
  }
}

module.exports = userAuth
