require('dotenv').config({ path: '../.env' })

const DEPLOY_BASE_URL = process.env.DEPLOY_BASE_URL || 'localhost:8000'
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const { Server } = require('socket.io')
const Redis = require('ioredis')

// ── Database ────────────────────────────────────────────────────────────
const connectDB = require('./config/db')

// ── Models ──────────────────────────────────────────────────────────────
const Deployment = require('./models/Deployment')

// ── Route modules ───────────────────────────────────────────────────────
const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projects')
const deploymentRoutes = require('./routes/deployments')

// ── Middleware ───────────────────────────────────────────────────────────
const errorHandler = require('./middleware/errorHandler')
const { sanitizeBody, validate, validators } = require('./middleware/validate')

const app = express()
const PORT = process.env.API_PORT || 9000

// ── Redis subscriber (for real-time log streaming only) ─────────────────
const subscriber = new Redis(process.env.REDIS_URL)

// ── Socket.IO ───────────────────────────────────────────────────────────
const io = new Server({
    cors: {
        origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
        credentials: true
    }
})

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        // Only allow well-formed log channels: logs:<slug>
        if (typeof channel !== 'string' || !/^logs:[a-z0-9-]{1,100}$/.test(channel)) {
            socket.emit('message', JSON.stringify({ log: 'Invalid channel name' }))
            return
        }
        socket.join(channel)
        socket.emit('message', JSON.stringify({ log: `Joined ${channel}` }))
    })
})

io.listen(process.env.SOCKET_PORT || 9002, () =>
    console.log(`Socket Server running on port ${process.env.SOCKET_PORT || 9002}`)
)

// ── ECS client ──────────────────────────────────────────────────────────
const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

// ── Global Middleware ───────────────────────────────────────────────────
app.use(helmet())                                 // security headers
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true                   // allow cookies cross-origin
}))
app.use(express.json({ limit: '100kb' }))   // reject oversized payloads
app.use(express.urlencoded({ extended: false, limit: '100kb' }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(sanitizeBody)                         // strip HTML from all inputs

// ── Global rate limiter ─────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 300,                    // 300 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later' }
})
app.use(globalLimiter)

// ── Request logger middleware ───────────────────────────────────────────
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})

// ── API Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/deploy', deploymentRoutes)

// ── Backward-compatible legacy endpoint ─────────────────────────────────
// The original frontend POSTs to /project — kept so nothing breaks
app.post('/project', async (req, res, next) => {
    try {
        const { gitURL, slug } = req.body

        // Validate gitURL format
        const gitError = validators.gitURL(gitURL)
        if (gitError) return res.status(400).json({ error: gitError })

        // Validate optional slug
        const slugError = validators.slug(slug)
        if (slugError) return res.status(400).json({ error: slugError })

        const projectSlug = slug ? slug : generateSlug()

        // Save deployment to MongoDB
        const deployment = await Deployment.create({
            slug: projectSlug,
            status: 'queued',
            gitURL,
            deployURL: `http://${projectSlug}.${DEPLOY_BASE_URL}`
        })

        // Spin the ECS container
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

// ── Health check ────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() })
})

// ── Global error handler (must be last) ─────────────────────────────────
app.use(errorHandler)

// ── Redis → Socket.IO log streaming ─────────────────────────────────────
async function initRedisSubscribe() {
    console.log('Subscribed to logs....')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })
}

// ── Start ───────────────────────────────────────────────────────────────
async function start() {
    // Connect to MongoDB first
    await connectDB()

    // Start Redis log subscription
    initRedisSubscribe()

    // Start Express
    app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`))
}

start()