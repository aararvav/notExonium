// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`)
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack)
    }

    const isProd = process.env.NODE_ENV === 'production'

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message)
        return res.status(400).json({ error: 'Validation failed', details: messages })
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        return res.status(409).json({
            error: isProd ? 'Duplicate entry' : `Duplicate value for '${field}'`
        })
    }

    // Mongoose cast error (invalid ObjectId etc.)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: isProd ? 'Invalid request parameter' : `Invalid ${err.path}: ${err.value}`
        })
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' })
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' })
    }

    // Default
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        error: isProd && statusCode === 500
            ? 'Internal Server Error'
            : (err.message || 'Internal Server Error')
    })
}

module.exports = errorHandler
