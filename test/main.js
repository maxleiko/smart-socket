var SmartSocket = require('../smart-socket');

var a = ['127.0.0.1:8040', '127.0.0.1:8041', '127.0.0.1:8042'],
    b = ['a.fr', 'b.com', 'kevoree.org'];

/**
 * Created by leiko on 03/03/14.
 */
var ss = new SmartSocket({
    addresses:  b,
    debug: false,
    timeout: 3000,
    loopBreak: 2000
});

ss.start();

ss.on('open', function (ws) {
    console.log('SERVER OPEN CONN', ws.url);
});

ss.on('message', function (ws, e) {
    console.log('MESSAGE from '+ ws.url, e.data);
});

ss.on('close', function (ws) {
    console.log('SERVER CLOSE CONN', ws.url);
});

ss.on('error', function (ws) {
    console.log('ERROR', ws.url);
});

ss.on('loopStart', function () {
    console.log('loop start');
});

ss.on('loopIn', function (waitFor) {
   console.log('loop in, waiting for '+waitFor+'ms before starting again...');
});

ss.on('loopEnd', function () {
    console.log('loop end');
});

//
//setTimeout(function () {
//    console.log('Shutdown SmartSocket');
//    ss.close();
//}, 5000);
