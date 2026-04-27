const express = require('express')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const User = require('../models/User')
const { protect } = require('../middleware/auth')
const { validate } = require('../middleware/validate')

const router = express.Router()

// ── Strict rate limiter for auth endpoints ──────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 15,                     // 15 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many attempts, please try again in 15 minutes' },
    skipSuccessfulRequests: true  // only count failed attempts
})

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
        sameSite: 'strict',                                    // CSRF protection
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
router.post('/register',
    authLimiter,
    validate({ name: 'name', email: 'email', password: 'password' }),
    async (req, res, next) => {
        try {
            const { name, email, password } = req.body

            // Check if user exists
            const existingUser = await User.findOne({ email: email.toLowerCase() })
            if (existingUser) {
                return res.status(409).json({ error: 'Email already registered' })
            }

            const user = await User.create({ name, email: email.toLowerCase(), password })

            sendTokenResponse(user, 201, res)
        } catch (error) {
            next(error)
        }
    }
)

// POST /api/auth/check-email
router.post('/check-email',
    validate({ email: 'email' }),
    async (req, res, next) => {
        try {
            const { email } = req.body

            // Check if user exists
            const existingUser = await User.findOne({ email: email.toLowerCase() })
            if (existingUser) {
                return res.status(409).json({ error: 'Email already registered' })
            }

            res.json({ success: true, message: 'Email available' })
        } catch (error) {
            next(error)
        }
    }
)
router.post('/login',
    authLimiter,
    validate({ email: 'email', password: 'password' }),
    async (req, res, next) => {
        try {
            const { email, password } = req.body

            // Find user and include password field for comparison
            const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
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
    }
)

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
