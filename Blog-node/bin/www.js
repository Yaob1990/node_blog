const http = require('http');
const PORT = 8080;
const serverHandle = require('../app.js');

const server = http.createServer(serverHandle);
server.listen(PORT);
