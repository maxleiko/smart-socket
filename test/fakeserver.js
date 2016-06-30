var WebSocketServer = require('ws').Server;

var port = 8040;

function startServer() {
  var wss = new WebSocketServer({ port: process.argv[2] || port }, function () {
    console.log('Server started on 0.0.0.0:' + wss.options.port);
  });
  wss.on('connection', function (ws) {
    ws.on('message', function (message) {
      console.log('received: %s', message);
    });
    ws.send('something');
  });

  wss.on('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      port++;
      startServer();
    }
  });
}

startServer();
