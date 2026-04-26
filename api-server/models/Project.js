const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    gitURL: {
        type: String,
        required: [true, 'Git URL is required'],
        trim: true
    },
    customSlug: {
        type: String,
        trim: true,
        lowercase: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

// Index for fast lookups by user
projectSchema.index({ userId: 1 })

module.exports = mongoose.model('Project', projectSchema)
