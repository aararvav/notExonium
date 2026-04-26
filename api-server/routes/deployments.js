const crypto = require('crypto')
const express = require('express')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const Deployment = require('../models/Deployment')
const Project = require('../models/Project')
const { protect } = require('../middleware/auth')
const { validate, validateParamId, validators } = require('../middleware/validate')

const router = express.Router()

const DEPLOY_BASE_URL = process.env.DEPLOY_BASE_URL || 'localhost:8000'

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

// POST /api/deploy — trigger a new deployment (requires auth)
router.post('/',
    protect,
    validate({ gitURL: 'gitURL', slug: 'slug', projectId: 'mongoId' }),
    async (req, res, next) => {
        try {
            const { projectId, gitURL, slug } = req.body

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
                deployURL: `http://${projectSlug}.${DEPLOY_BASE_URL}`
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
                    url: `http://${projectSlug}.${DEPLOY_BASE_URL}`
                }
            })
        } catch (error) {
            next(error)
        }
    }
)

// ─────────────────────────────────────────────────────────────
// The original /project endpoint — kept for backward compatibility
// so the existing frontend still works without auth
// ─────────────────────────────────────────────────────────────
router.post('/project', async (req, res, next) => {
    try {
        const { gitURL, slug } = req.body

        // Validate inputs
        const gitError = validators.gitURL(gitURL)
        if (gitError) return res.status(400).json({ error: gitError })

        const slugError = validators.slug(slug)
        if (slugError) return res.status(400).json({ error: slugError })

        const projectSlug = slug ? slug : generateSlug()

        // Create deployment record (no user association)
        const deployment = await Deployment.create({
            slug: projectSlug,
            status: 'queued',
            gitURL,
            deployURL: `http://${projectSlug}.${DEPLOY_BASE_URL}`
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
            data: { projectSlug, url: `http://${projectSlug}.${DEPLOY_BASE_URL}` }
        })
    } catch (error) {
        next(error)
    }
})

// GET /api/deploy/:slug — get deployment status by slug
router.get('/:slug', async (req, res, next) => {
    try {
        // Validate slug format to prevent NoSQL injection
        const slug = req.params.slug
        if (!slug || slug.length > 100 || /[^a-z0-9-]/.test(slug)) {
            return res.status(400).json({ error: 'Invalid slug format' })
        }

        const deployment = await Deployment.findOne({ slug })
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

        // Validate projectId if provided
        if (projectId) {
            const idError = validators.mongoId(projectId)
            if (idError) return res.status(400).json({ error: idError })
        }

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
router.patch('/:id/status', validateParamId, async (req, res, next) => {
    try {
        // Verify internal token (timing-safe to prevent side-channel attacks)
        const authHeader = req.headers.authorization || ''
        const expected = `Bearer ${process.env.INTERNAL_API_TOKEN}`
        const headerBuf = Buffer.from(authHeader)
        const expectedBuf = Buffer.from(expected)
        if (headerBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(headerBuf, expectedBuf)) {
            return res.status(403).json({ error: 'Forbidden' })
        }

        const { status } = req.body
        const statusError = validators.deployStatus(status)
        if (statusError) return res.status(400).json({ error: statusError })

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
