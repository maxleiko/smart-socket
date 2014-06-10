var SmartSocket = require('../smart-socket');

/**
 * Created by leiko on 03/03/14.
 */
var ss = new SmartSocket({
    addresses:  ['kevoree.org:8040', '127.0.0.1:8041', '127.0.0.1:8042'],
    debug: false,
    timeout: 5000,
    handlers: {
        onopen: function (ws) {
            console.log('SERVER OPEN CONN', ws.url);
        },
        onmessage: function (ws, e) {
            console.log('MESSAGE from '+ ws.url, e.data);
        },
        onclose: function (ws) {
            console.log('SERVER CLOSE CONN', ws.url);
        },
        onerror: function (ws) {
            console.log('ERROR', ws.url);
        }
    }
});

ss.start();
//
//setTimeout(function () {
//    console.log('Shutdown SmartSocket');
//    ss.close();
//}, 5000);