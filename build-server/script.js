const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const Redis = require('ioredis')


const publisher = new Redis(process.env.REDIS_URL || '')


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const PROJECT_ID = process.env.PROJECT_ID


function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }))
}

async function init() {
    console.log('Executing script.js')
    publishLog('Build Started...')
    const outDirPath = path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function (data) {
        console.log(data.toString())
        publishLog(data.toString())
    })

    p.stderr.on('data', function (data) {
        console.log('stderr:', data.toString())
        publishLog(`stderr: ${data.toString()}`)
    })

    p.on('close', async function (code) {
        console.log('Build Complete')
        publishLog(`Build Complete`)
        
        const outputPath = path.join(__dirname, 'output')
        
        // Try to find the build output folder (supports Vite, Next.js, CRA, etc.)
        const possibleDirs = ['dist', '.next/static', '.next', 'build', 'public', 'out', '_build']
        let distFolderPath = null
        
        for (const dir of possibleDirs) {
            const fullPath = path.join(outputPath, dir)
            try {
                if (fs.existsSync(fullPath)) {
                    distFolderPath = fullPath
                    publishLog(`Found build output at: ${dir}`)
                    console.log(`Found build output at: ${dir}`)
                    break
                }
            } catch (e) {
                // Continue to next
            }
        }
        
        if (!distFolderPath) {
            publishLog(`ERROR: No build output found. Checked: ${possibleDirs.join(', ')}`)
            console.error(`ERROR: No build output found. Checked: ${possibleDirs.join(', ')}`)
            return
        }

        try {
            const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

            publishLog(`Starting to upload ${distFolderContents.length} files`)
            
            let uploadedCount = 0
            for (const file of distFolderContents) {
                const filePath = path.join(distFolderPath, file)
                if (fs.lstatSync(filePath).isDirectory()) continue;

                console.log('uploading', filePath)
                publishLog(`uploading ${file}`)

                const command = new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `__outputs/${PROJECT_ID}/${file}`,
                    Body: fs.createReadStream(filePath),
                    ContentType: mime.lookup(filePath)
                })

                await s3Client.send(command)
                uploadedCount++
                publishLog(`uploaded ${file}`)
                console.log('uploaded', filePath)
            }
            publishLog(`Done - Uploaded ${uploadedCount} files`)
            console.log('Done...')
        } catch (error) {
            publishLog(`Upload error: ${error.message}`)
            console.error('Upload error:', error)
        }
    })
}

init()