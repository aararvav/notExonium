const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Helper: generate JWT and set it as httpOnly cookie
function sendTokenResponse(user, statusCode, res) {
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    const cookieOptions = {
        httpOnly: true,                                        // not accessible via JS
        secure: process.env.NODE_ENV === 'production',         // HTTPS only in prod
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,                     // 7 days
        domain: process.env.COOKIE_DOMAIN || undefined
    }

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            token,     // also send in body so frontend can use if needed
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide name, email and password' })
        }

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' })
        }

        const user = await User.create({ name, email, password })

        sendTokenResponse(user, 201, res)
    } catch (error) {
        next(error)
    }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' })
        }

        // Find user and include password field for comparison
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        sendTokenResponse(user, 200, res)
    } catch (error) {
        next(error)
    }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res
        .cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        })
        .json({ success: true, message: 'Logged out' })
})

// GET /api/auth/me  — get current logged-in user
router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    })
})

module.exports = router
