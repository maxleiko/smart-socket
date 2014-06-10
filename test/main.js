var SmartSocket = require('../smart-socket');

/**
 * Created by leiko on 03/03/14.
 */
var ss = new SmartSocket({
    addresses:  ['127.0.0.1:8040', '127.0.0.1:8041', '127.0.0.1:8042'],
    debug: false,
    timeout: 3000,
    loopBreak: 3000
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

ss.on('loopEnd', function () {
   console.log('loop end');
});

//
//setTimeout(function () {
//    console.log('Shutdown SmartSocket');
//    ss.close();
//}, 5000);