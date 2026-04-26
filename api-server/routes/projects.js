const express = require('express')
const Project = require('../models/Project')
const { protect } = require('../middleware/auth')

const router = express.Router()

// All project routes require authentication
router.use(protect)

// POST /api/projects — create a new project
router.post('/', async (req, res, next) => {
    try {
        const { name, gitURL, customSlug } = req.body

        if (!name || !gitURL) {
            return res.status(400).json({ error: 'Please provide project name and gitURL' })
        }

        const project = await Project.create({
            name,
            gitURL,
            customSlug: customSlug || undefined,
            userId: req.user._id
        })

        res.status(201).json({ success: true, data: project })
    } catch (error) {
        next(error)
    }
})

// GET /api/projects — list all projects for the logged-in user
router.get('/', async (req, res, next) => {
    try {
        const projects = await Project.find({ userId: req.user._id })
            .sort({ createdAt: -1 })

        res.json({ success: true, data: projects })
    } catch (error) {
        next(error)
    }
})

// GET /api/projects/:id — get a single project
router.get('/:id', async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!project) {
            return res.status(404).json({ error: 'Project not found' })
        }

        res.json({ success: true, data: project })
    } catch (error) {
        next(error)
    }
})

// PUT /api/projects/:id — update a project
router.put('/:id', async (req, res, next) => {
    try {
        const { name, gitURL, customSlug } = req.body

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { name, gitURL, customSlug },
            { new: true, runValidators: true }
        )

        if (!project) {
            return res.status(404).json({ error: 'Project not found' })
        }

        res.json({ success: true, data: project })
    } catch (error) {
        next(error)
    }
})

// DELETE /api/projects/:id — delete a project
router.delete('/:id', async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!project) {
            return res.status(404).json({ error: 'Project not found' })
        }

        res.json({ success: true, message: 'Project deleted' })
    } catch (error) {
        next(error)
    }
})

module.exports = router
