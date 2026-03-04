require('dotenv').config();
const express = require('express');
const {generateSlug} = require('random-word-slugs');
const {ECSClient, RunTaskCommand} = require('@aws-sdk/client-ecs');
const {Server} = require('socket.io');
const Redis = require('ioredis');


const subscriber  = new Redis(process.env.REDIS_URL);

const io = new Server({cors : '*'});

io.on('connection', (socket)=>
{
    socket.on('subscribe', channel =>
    {
        socket.join(channel);
        socket.emit('message', `Joined ${channel} successfully.`);
    })
});

io.listen(9001, ()=> console.log('Socket Server is running on port 9001'));

const app = express();
const PORT = 9000;

const ecsClient = new ECSClient
({
    region : process.env.AWS_REGION,
    credentials : 
    {
        accessKeyId : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
    } 
});

const config = 
{
    CLUSTER : process.env.ECS_CLUSTER,
    TASK : process.env.ECS_TASK
};

app.use(express.json());

app.post('/project', async(req, res) => 
{
    const {gitURL, slug} = req.body;
    const projectSlug = slug ? slug :generateSlug();
    //spin the container 

    const command = new RunTaskCommand
    ({
        cluster : config.CLUSTER,
        taskDefinition : config.TASK,
        launchType : 'FARGATE',
        count : 1,
        networkConfiguration: 
        {
            awsvpcConfiguration:
            {
                subnets : ['subnet-0a0c7c25c68c8c642', 'subnet-0bf16160c0e8af08e', 'subnet-0cbabb48bd6f0f57b'],
                securityGroups: ['sg-0fc983d14c2bf9fdc'],
                assignPublicIp: 'ENABLED'
            }
        },
        overrides:
        {
            containerOverrides : 
            [
                {
                    name : 'builder-image',
                    environment : 
                    [
                        {name : 'GIT_REPOSITORY__URL', value : gitURL},
                        {name : 'PROJECT_ID', value : projectSlug}
                    ]
                }
            ]
        }
    });

    await ecsClient.send(command);
    return res.json({status: 'queued', data :{projectSlug, url : `https://${projectSlug}.localhost:8000`}});
});


async function initRedisSubscribe()
{
    console.log("Subscribing to Redis channel...");
    subscriber.psubscribe(`logs:*`);
    subscriber.on('pmessage', (pattern, channel, message)=>
    {
        io.to(channel).emit('message', message);
    });
    console.log("Subscribed to Redis channel.");
};

initRedisSubscribe();
app.listen(PORT, () => console.log(`API Server is running on port ${PORT}`));