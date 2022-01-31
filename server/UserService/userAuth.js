const jwt = require('jsonwebtoken')

function userAuth(req, res, next) {
	try {
		const userToken = req.cookies.UserToken

		if (!userToken) {
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
