const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// const VideoMetaData = require('../Models/VideoMetaData.js')
// const ChannelMetaData = require('../Models/ChannelMetaData.js')
// const ModelMetaData = require('../Models/ModelMetaData.js')
const User = require('../Models/User.js')
const userAuth = require('./userAuth.js')

router.post('/register', async (req, res) => {
	try {
		const { name, email, password } = req.body

		if (!name || !email || !password) {
			return res.status(400).json({ message: 'fill all the fields' })
		}

		const existingUser = await User.findOne({ email: email })

		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' })
		}

		const salt = await bcrypt.genSalt()
		const hashedpassword = await bcrypt.hash(password, salt)

		const newUser = new User({
			name: name,
			email: email,
			password: password,
			hashedpassword: hashedpassword
		})

		await newUser.save()

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

		const existingUser = await User.findOne({ email: email })
		if (!existingUser) {
			return res.status(401).json({ message: 'Invalid Email or Password' })
		}

		const isPasswordValid = await bcrypt.compare(password, existingUser.hashedpassword)

		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid email or password' })
		}

		const userToken = jwt.sign({
			id: existingUser._id,
			name: existingUser.name,
			email: existingUser.email
		}, process.env.JWT_SECRET)
		return res.status(200)
			.cookie('UserToken', userToken, { httpOnly: true })
			.json({ message: 'Login Success' })
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

router.get('/verify', userAuth, (req, res) => {
	const { id, name, email } = req.userInfo

	return res.json({
		authorized: true,
		message: 'Success',
		id,
		name,
		email
	}).status(200)
})

module.exports = router
