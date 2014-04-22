# smart-socket

API
```js
var SmartSocket = require('smart-socket');

var ss = new SmartSocket({
    addresses: ['127.0.0.1:8042'],  // array of addresses to try to connect to (order is kept)
    timeout: 5042,                  // [optional] will restart the connection loop if all given addresses
                                    // failed to establish a connection. (default is 2000ms)
    handlers: {
        onopen: function (ws, event) {
            // ws: WebSocket object related to the successful connection
            // event: OpenEvent if any
        },

        onmessage: function (ws, event) {
            // ws: WebSocket object related to the successful connection
            // event: MessageEvent if any
        },

        onerror: function (ws, event) {
            // ws: WebSocket object related to the successful connection
            // event: ErrorEvent if any
        },

        onclose: function (ws, event) {
            // ws: WebSocket object related to the successful connection
            // event: CloseEvent if any
        },
    }
});

ss.start();

// once you are done looping
ss.stop(); // note that stop() won't force stop, it will wait for the remote server to hang-up the connection before stopping
           // if you don't want to wait, you can call close()

// immediately close the connection to the connected server but let the connection loop active
ss.close(false);
// or immediately close the connection to the connected server and stops connection loop
ss.close(true); // ss.close(); is the same
```