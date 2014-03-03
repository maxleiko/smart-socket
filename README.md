# smart-socket

API
```js
var SmartSocket = require('smart-socket');

SmartSocket({
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
```