const mongoose = require('mongoose')

const deploymentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['queued', 'building', 'success', 'failed'],
        default: 'queued'
    },
    gitURL: {
        type: String,
        required: true
    },
    deployURL: {
        type: String
    },
    ecsTaskArn: {
        type: String
    }
}, {
    timestamps: true
})

// Index for fast lookups
deploymentSchema.index({ projectId: 1 })

module.exports = mongoose.model('Deployment', deploymentSchema)
