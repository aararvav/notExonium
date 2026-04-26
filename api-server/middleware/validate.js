// ── Input validation & sanitization middleware ──────────────────────────

/**
 * Strips HTML tags, trims whitespace, and collapses multiple spaces.
 */
function sanitize(value) {
    if (typeof value !== 'string') return value
    return value
        .replace(/<[^>]*>/g, '')   // strip HTML tags
        .replace(/&/g, '&amp;')    // encode ampersands
        .replace(/</g, '&lt;')     // encode remaining angle brackets
        .replace(/>/g, '&gt;')
        .trim()
        .replace(/\s+/g, ' ')     // collapse whitespace
}

/**
 * Recursively sanitize all string values in an object.
 */
function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj
    const clean = {}
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            clean[key] = sanitize(value)
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            clean[key] = sanitizeObject(value)
        } else {
            clean[key] = value
        }
    }
    return clean
}

/**
 * Middleware: sanitize req.body (strips HTML, trims whitespace)
 */
function sanitizeBody(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body)
    }
    next()
}

// ── Regex patterns ──────────────────────────────────────────────────────

const GITHUB_URL_RE = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}$/
const MONGO_ID_RE = /^[0-9a-fA-F]{24}$/
const NAME_RE = /^[\p{L}\p{N}\s._-]{1,100}$/u       // unicode letters/numbers, max 100
const PROJECT_NAME_RE = /^[\p{L}\p{N}\s._@/-]{1,150}$/u

// ── Field validators ────────────────────────────────────────────────────

const validators = {
    /** Validates a GitHub HTTPS URL */
    gitURL(value) {
        if (!value || typeof value !== 'string') return 'gitURL is required'
        if (value.length > 300) return 'gitURL is too long (max 300 chars)'
        if (!GITHUB_URL_RE.test(value)) return 'gitURL must be a valid GitHub HTTPS URL (https://github.com/owner/repo)'
        return null
    },

    /** Validates an email address */
    email(value) {
        if (!value || typeof value !== 'string') return 'Email is required'
        if (value.length > 254) return 'Email is too long'
        if (!EMAIL_RE.test(value)) return 'Invalid email format'
        return null
    },

    /** Validates a user name */
    name(value) {
        if (!value || typeof value !== 'string') return 'Name is required'
        if (value.length < 1 || value.length > 100) return 'Name must be 1–100 characters'
        if (!NAME_RE.test(value)) return 'Name contains invalid characters'
        return null
    },

    /** Validates a password (no format restriction, just length) */
    password(value) {
        if (!value || typeof value !== 'string') return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        if (value.length > 128) return 'Password is too long (max 128 chars)'
        return null
    },

    /** Validates a project name */
    projectName(value) {
        if (!value || typeof value !== 'string') return 'Project name is required'
        if (value.length > 150) return 'Project name is too long (max 150 chars)'
        if (!PROJECT_NAME_RE.test(value)) return 'Project name contains invalid characters'
        return null
    },

    /** Validates an optional custom slug */
    slug(value) {
        if (!value) return null  // optional
        if (typeof value !== 'string') return 'Slug must be a string'
        if (value.length > 63) return 'Slug is too long (max 63 chars)'
        if (!SLUG_RE.test(value)) return 'Slug must be lowercase alphanumeric with hyphens'
        return null
    },

    /** Validates a MongoDB ObjectId */
    mongoId(value) {
        if (!value) return null  // optional
        if (typeof value !== 'string') return 'ID must be a string'
        if (!MONGO_ID_RE.test(value)) return 'Invalid ID format'
        return null
    },

    /** Validates deployment status values */
    deployStatus(value) {
        if (!value || typeof value !== 'string') return 'Status is required'
        if (!['building', 'success', 'failed'].includes(value)) return 'Invalid status value'
        return null
    }
}

/**
 * Factory: creates validation middleware for specific fields.
 *
 * Usage:
 *   validate({ name: 'name', email: 'email', password: 'password' })
 *
 * Keys = req.body field names. Values = validator function names.
 */
function validate(fieldMap) {
    return (req, res, next) => {
        const errors = {}

        for (const [bodyField, validatorName] of Object.entries(fieldMap)) {
            const validatorFn = validators[validatorName]
            if (!validatorFn) continue

            const error = validatorFn(req.body[bodyField])
            if (error) {
                errors[bodyField] = error
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            })
        }

        next()
    }
}

/**
 * Validates req.params.id as a MongoDB ObjectId.
 */
function validateParamId(req, res, next) {
    const id = req.params.id || req.params.slug
    // Only validate if it looks like it should be a Mongo ID (24 hex chars)
    // Slugs are allowed through
    if (req.params.id && !MONGO_ID_RE.test(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' })
    }
    next()
}

module.exports = {
    sanitize,
    sanitizeBody,
    validate,
    validateParamId,
    validators
}
