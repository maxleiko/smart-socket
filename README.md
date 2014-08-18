# smart-socket

```sh
npm i smart-socket --save
```

## API
SmartSocket inherits from `events.EventEmitter`  

#### SmartSocket.start()
```js
/**
 * Starts the WebSocket connection tasks loop over given addresses
 */
SmartSocket.prototype.start = function () { /* ... */ }
```
#### SmartSocket.stop()
```js
/**
 * Prevents SmartSocket from retrying connection tasks in the future
 */
SmartSocket.prototype.stop = function () { /* ... */ }
```
#### SmartSocket.close()
```js
/**
 * Immediately close() connected WebSocket (does nothing if none connected)
 * @param stop {boolean} [optional, default = true] if true, close() will also call this.stop() and prevent SmartSocket from looping through connection tasks
 */
SmartSocket.prototype.close = function (stop) { /* ... */ }
```

## Events
#### open
```js
ss.on('open', function (ws, event) {
  // ws: WebSocket object related to the successful connection
  // event: OpenEvent if any
});
```
#### message
```js
ss.on('message', function (ws, event) {
  // ws: WebSocket object related to the successful connection
  // event: MessageEvent if any
});
```
#### close
```js
ss.on('close', function (ws, event) {
  // ws: WebSocket object related to the successful connection
  // event: CloseEvent if any
});
```
#### error
```js
ss.on('error', function (ws, event) {
  // ws: WebSocket object related to the successful connection
  // event: ErrorEvent if any
});
```
#### loopStart
```js
ss.on('loopStart', function () {
  // emitted on loop start
});
```
#### loopEnd
```js
ss.on('loopEnd', function () {
  // emitted on loop end
});
```

## Example
```js
var SmartSocket = require('smart-socket');

var ss = new SmartSocket({
    addresses: ['127.0.0.1:8042'],  // array of addresses to try to connect to (order is kept)
    timeout: 10000,                 // [optional] connection timeout for Web sockets in milliseconds
    loopBreak: 2000                 // [optional] time between two loops in milliseconds
});

ss.on('open', function (ws, event) {
  // ws: WebSocket object related to the successful connection
  // event: OpenEvent if any
});
ss.on('message', function (ws, event) {
  // ws: WebSocket object related to the successful connection
  // event: MessageEvent if any
});
ss.on('close', function (ws, event) {
  // ws: WebSocket object related to the successful connection
  // event: CloseEvent if any
});
ss.on('error', function (ws, event) {
  // ws: WebSocket object related to the successful connection
  // event: ErrorEvent if any
});
ss.on('loopStart', function () {
  // emitted on loop start
});
ss.on('loopIn', function (waitFor) {
  // emitted when a loop ends but no connection is made (so it will loop again in "waitFor" milliseconds
});
ss.on('loopEnd', function () {
  // emitted on loop end (when connection is made though)
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
