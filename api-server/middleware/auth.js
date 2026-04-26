const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes — verifies JWT from cookie or Authorization header
const protect = async (req, res, next) => {
    let token = null

    // 1. Check httpOnly cookie first
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token
    }

    // 2. Fallback to Authorization header (Bearer token)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Attach user to request (without password)
        req.user = await User.findById(decoded.id).select('-password')

        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized, user not found' })
        }

        next()
    } catch (error) {
        console.error('JWT verification failed:', error.message)
        return res.status(401).json({ error: 'Not authorized, token invalid' })
    }
}

module.exports = { protect }
