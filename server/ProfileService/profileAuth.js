const jwt = require('jsonwebtoken')
const Profile = require('../Models/Profile.js')

async function userAuth(req, res, next) {
  try {
    const userToken = req.cookies.UserToken

    if (!userToken) {
      return res.json({ authorized: false, message: 'Unauthorized' })
    }

    const { _id } = userToken;

    if (await Profile.findById(_id)) {
      return res.json({ authorized: false, message: 'Unauthorized' })
    }

    req.userInfo = jwt.verify(userToken, process.env.JWT_SECRET)

    next()
  } catch (err) {
    console.error(err)
    res.json({ authorized: false, message: 'Unauthorized' })
  }
}

module.exports = userAuth
