const {exec} = require("child_process");
const path = require('path');
const fs  = require('fs');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');


const publisher  = new Redis(process.env.REDIS_URL);

const s3Client = new S3Client
({
    region : process.env.AWS_REGION,
    credentials : 
    {
        accessKeyId : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
    } 
})

const PROJECT_ID = process.env.PROJECT_ID;

function publishLog(log)
{
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({log}));
}

async function init() 
{
    console.log("Executing script...");
    publishLog("Build process started...");
    const outDirPath =  path.join(__dirname, 'output');

    const proc = exec(`cd ${outDirPath} && rm -rf node_modules package-lock.json && npm install && npm run build`);

    proc.stdout.on('data', function(data)
    {
        console.log(data.toString());
        publishLog(data.toString());
    });

    proc.stderr.on('data', function(data)
    {
        console.log(data.toString());
        publishLog(`Error: ${data.toString()}`);
    });

    proc.on('close',async function(){
        console.log("Build process completed.");
        publishLog("Build process completed.");
        const disDirPath = path.join(__dirname, 'output', 'dist');
        const distDirContents = fs.readdirSync(disDirPath, {recursive: true});
        
        publishLog("Uploading files to S3...");
        for(const file of distDirContents)
        {
            const filePath = path.join(disDirPath, file);
            if(fs.lstatSync(filePath).isDirectory()) continue;

            console.log(`Uploading ${filePath} to S3...`);
            publishLog(`Uploading ${file} to S3...`);

            const command  = new PutObjectCommand
            ({
                Bucket : 'exonium-output',
                Key : `__outputs/${PROJECT_ID}/${file}`,
                Body : fs.createReadStream(filePath),
                ContentType : mime.lookup(filePath)
            })

            await s3Client.send(command);
            publishLog(`Uploaded ${file} to S3.`);
            console.log(`Uploaded ${filePath} to S3.`);
        }
        publishLog("Done...");
        console.log("Done...");
    });

}

init();