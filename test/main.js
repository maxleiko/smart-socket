var SmartSocket = require('../smart-socket');

/**
 * Created by leiko on 03/03/14.
 */
SmartSocket({
    addresses:  ['127.0.0.1:8040', '127.0.0.1:8041', '127.0.0.1:8042'],
    handlers: {
        onopen: function (ws) {
            console.log('SERVER OPEN CONN');
            ws.send('msg');
        },
        onmessage: function (ws, e) {
            console.log('MESSAGE', e.data);
        },
        onclose: function (ws) {
            console.log('SERVER CLOSE CONN');
        }
    }
});