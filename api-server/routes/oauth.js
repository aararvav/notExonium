const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const User = require('../models/User')

const router = express.Router()

// Configure Passport strategies
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:9000'}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id })

        if (user) {
            return done(null, user)
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value })

        if (user) {
            // Link Google account to existing user
            user.googleId = profile.id
            user.avatar = user.avatar || profile.photos[0].value
            await user.save()
            return done(null, user)
        }

        // Create new user
        user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value
        })

        done(null, user)
    } catch (error) {
        done(error, null)
    }
}))

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:9000'}/api/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this GitHub ID
        let user = await User.findOne({ githubId: profile.id })

        if (user) {
            return done(null, user)
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value })

        if (user) {
            // Link GitHub account to existing user
            user.githubId = profile.id
            user.avatar = user.avatar || profile.photos[0].value
            await user.save()
            return done(null, user)
        }

        // Create new user
        user = await User.create({
            name: profile.displayName || profile.username,
            email: profile.emails[0].value,
            githubId: profile.id,
            avatar: profile.photos[0].value
        })

        done(null, user)
    } catch (error) {
        done(error, null)
    }
}))

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})

// Helper function to send token response
function sendTokenResponse(user, res) {
    const token = require('jsonwebtoken').sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.COOKIE_DOMAIN || undefined
    }

    res
        .status(200)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        })
}

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login` }),
    (req, res) => {
        // Successful authentication, redirect to frontend with token data
        const token = require('jsonwebtoken').sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        const userData = encodeURIComponent(JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        }))

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}&user=${userData}`)
    }
)

// GitHub OAuth routes
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
)

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login` }),
    (req, res) => {
        // Successful authentication, redirect to frontend with token data
        const token = require('jsonwebtoken').sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        const userData = encodeURIComponent(JSON.stringify({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        }))

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}&user=${userData}`)
    }
)

module.exports = router