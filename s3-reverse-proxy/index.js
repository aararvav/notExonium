const express = require('express');
const httpProxy = require('http-proxy');



const app = express();
const PORT = 8000;

const BASE_PATH = 'https://exonium-output.s3.ap-south-1.amazonaws.com/__outputs/';

const proxy = httpProxy.createProxy();

app.use((req, res) =>
{
    const hostName = req.hostname;
    const subdomain = hostName.split('.')[0];


    //custom domain using a query for DB


    const resolvesTo = `${BASE_PATH}/${subdomain}`;

    return proxy.web(req, res, {target : resolvesTo, changeOrigin : true});
});

proxy.on('proxyReq', (proxyReq, req, res) => 
{
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'
})


app.listen(PORT, () => console.log(`Reverse Proxy is running on port ${PORT}`));
