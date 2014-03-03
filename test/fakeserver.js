var WebSocketServer = require('ws').Server,
    wss             = new WebSocketServer({port: process.argv[2] || 8042});

wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});