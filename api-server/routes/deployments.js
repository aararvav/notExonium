const express = require('express')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const Deployment = require('../models/Deployment')
const Project = require('../models/Project')
const { protect } = require('../middleware/auth')

const router = express.Router()

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

// POST /api/deploy — trigger a new deployment (requires auth)
router.post('/', protect, async (req, res, next) => {
    try {
        const { projectId, gitURL, slug } = req.body

        if (!gitURL) {
            return res.status(400).json({ error: 'gitURL is required' })
        }

        const projectSlug = slug ? slug : generateSlug()

        // If projectId is provided, verify it belongs to this user
        let project = null
        if (projectId) {
            project = await Project.findOne({ _id: projectId, userId: req.user._id })
            if (!project) {
                return res.status(404).json({ error: 'Project not found' })
            }
        }

        // Create deployment record in MongoDB
        const deployment = await Deployment.create({
            projectId: project ? project._id : undefined,
            slug: projectSlug,
            status: 'queued',
            gitURL,
            deployURL: `http://${projectSlug}.localhost:8000`
        })

        // Spin up the ECS Fargate container
        const command = new RunTaskCommand({
            cluster: process.env.ECS_CLUSTER,
            taskDefinition: process.env.ECS_TASK,
            launchType: 'FARGATE',
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: 'ENABLED',
                    subnets: [
                        process.env.VPC_SUBNET_1,
                        process.env.VPC_SUBNET_2,
                        process.env.VPC_SUBNET_3
                    ],
                    securityGroups: [process.env.SECURITY_GROUP]
                }
            },
            overrides: {
                containerOverrides: [
                    {
                        name: 'builder-image',
                        environment: [
                            { name: 'GIT_REPOSITORY__URL', value: gitURL },
                            { name: 'PROJECT_ID', value: projectSlug },
                            { name: 'REDIS_URL', value: process.env.REDIS_URL },
                            { name: 'AWS_REGION', value: process.env.AWS_REGION },
                            { name: 'AWS_ACCESS_KEY_ID', value: process.env.AWS_ACCESS_KEY_ID },
                            { name: 'AWS_SECRET_ACCESS_KEY', value: process.env.AWS_SECRET_ACCESS_KEY },
                            { name: 'S3_BUCKET_NAME', value: process.env.S3_BUCKET_NAME },
                            { name: 'DEPLOYMENT_ID', value: deployment._id.toString() },
                            { name: 'INTERNAL_API_TOKEN', value: process.env.INTERNAL_API_TOKEN },
                            { name: 'INTERNAL_API_URL', value: process.env.INTERNAL_API_URL }
                        ]
                    }
                ]
            }
        })

        const ecsResponse = await ecsClient.send(command)

        // Store the ECS task ARN if available
        if (ecsResponse.tasks && ecsResponse.tasks[0]) {
            deployment.ecsTaskArn = ecsResponse.tasks[0].taskArn
            await deployment.save()
        }

        return res.json({
            status: 'queued',
            data: {
                deploymentId: deployment._id,
                projectSlug,
                url: `http://${projectSlug}.localhost:8000`
            }
        })
    } catch (error) {
        next(error)
    }
})

// ─────────────────────────────────────────────────────────────
// The original /project endpoint — kept for backward compatibility
// so the existing frontend still works without auth
// ─────────────────────────────────────────────────────────────
router.post('/project', async (req, res, next) => {
    try {
        const { gitURL, slug } = req.body
        const projectSlug = slug ? slug : generateSlug()

        // Create deployment record (no user association)
        const deployment = await Deployment.create({
            slug: projectSlug,
            status: 'queued',
            gitURL,
            deployURL: `http://${projectSlug}.localhost:8000`
        })

        const command = new RunTaskCommand({
            cluster: process.env.ECS_CLUSTER,
            taskDefinition: process.env.ECS_TASK,
            launchType: 'FARGATE',
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: 'ENABLED',
                    subnets: [
                        process.env.VPC_SUBNET_1,
                        process.env.VPC_SUBNET_2,
                        process.env.VPC_SUBNET_3
                    ],
                    securityGroups: [process.env.SECURITY_GROUP]
                }
            },
            overrides: {
                containerOverrides: [
                    {
                        name: 'builder-image',
                        environment: [
                            { name: 'GIT_REPOSITORY__URL', value: gitURL },
                            { name: 'PROJECT_ID', value: projectSlug },
                            { name: 'REDIS_URL', value: process.env.REDIS_URL },
                            { name: 'AWS_REGION', value: process.env.AWS_REGION },
                            { name: 'AWS_ACCESS_KEY_ID', value: process.env.AWS_ACCESS_KEY_ID },
                            { name: 'AWS_SECRET_ACCESS_KEY', value: process.env.AWS_SECRET_ACCESS_KEY },
                            { name: 'S3_BUCKET_NAME', value: process.env.S3_BUCKET_NAME }
                        ]
                    }
                ]
            }
        })

        await ecsClient.send(command)

        return res.json({
            status: 'queued',
            data: { projectSlug, url: `http://${projectSlug}.localhost:8000` }
        })
    } catch (error) {
        next(error)
    }
})

// GET /api/deploy/:slug — get deployment status by slug
router.get('/:slug', async (req, res, next) => {
    try {
        const deployment = await Deployment.findOne({ slug: req.params.slug })
            .populate('projectId', 'name gitURL')

        if (!deployment) {
            return res.status(404).json({ error: 'Deployment not found' })
        }

        res.json({ success: true, data: deployment })
    } catch (error) {
        next(error)
    }
})

// GET /api/deploy — list deployments for a project (requires auth)
router.get('/', protect, async (req, res, next) => {
    try {
        const { projectId } = req.query

        let filter = {}
        if (projectId) {
            // Verify the project belongs to the user
            const project = await Project.findOne({ _id: projectId, userId: req.user._id })
            if (!project) {
                return res.status(404).json({ error: 'Project not found' })
            }
            filter.projectId = projectId
        }

        const deployments = await Deployment.find(filter)
            .sort({ createdAt: -1 })
            .limit(50)

        res.json({ success: true, data: deployments })
    } catch (error) {
        next(error)
    }
})

// PATCH /api/deploy/:id/status — internal endpoint for build-server to update status
router.patch('/:id/status', async (req, res, next) => {
    try {
        // Verify internal token
        const authHeader = req.headers.authorization
        if (!authHeader || authHeader !== `Bearer ${process.env.INTERNAL_API_TOKEN}`) {
            return res.status(403).json({ error: 'Forbidden' })
        }

        const { status } = req.body
        if (!['building', 'success', 'failed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const deployment = await Deployment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if (!deployment) {
            return res.status(404).json({ error: 'Deployment not found' })
        }

        res.json({ success: true, data: deployment })
    } catch (error) {
        next(error)
    }
})

module.exports = router
