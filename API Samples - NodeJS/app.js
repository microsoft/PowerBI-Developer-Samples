const express = require('express');
var pbiApiCalls = require('./powerbi-api-calls-sample.js');

let PORT = (process.env.NODE_ENV !== 'production') ? 8080 : 80;
const HOST = '0.0.0.0';
const app = express();

var router = express.Router();
router.get("/get-report", pbiApiCalls.getReport);
router.get("/generate-embed-token", pbiApiCalls.generateEmbedToken);
router.get("/generate-embed-token-with-roles", pbiApiCalls.generateEmbedTokenWithRls);

app.use('/api', router);
app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);