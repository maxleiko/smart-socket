var WebSocket   = require('ws'),
    async       = require('async');

function connectionTask(address, handlers, reconnect, options) {
    handlers.onopen = handlers.onopen       || function () {};
    handlers.onclose = handlers.onclose     || function () {};
    handlers.onerror = handlers.onerror     || function () {};
    handlers.onmessage = handlers.onmessage || function () {};

    return function (cb) {
        if (options.debug) console.log('Trying to connect to ws://'+address);
        var ws = new WebSocket('ws://'+address);
        this.wasOpen = false;

        ws.onopen = function (arg) {
            if (options.debug) console.log('Connection to '+address+' established.');
            this.wasOpen = true;
            cb(ws);
            handlers.onopen.apply(ws, [ws, arg]);
        }.bind(this);

        ws.onerror = function (arg) {
            if (options.debug) console.log('Error: '+address, arg);
            cb(null); // try next
            handlers.onerror.apply(ws, [ws, arg]);
        }.bind(this);

        ws.onclose = function (arg) {
            if (options.debug) console.log('Close: '+address, arg);
            if (this.wasOpen) reconnect(options);
            handlers.onclose.apply(ws, [ws, arg]);
        }.bind(this);

        ws.onmessage = function (arg) {
            if (options.debug) console.log('Message: '+address, arg.data);
            handlers.onmessage.apply(ws, [ws, arg]);
        }
    }
}

var SmartSocket = function constructor(options) {
    options.addresses = options.addresses || [];
    options.timeout   = options.timeout   || 2000;
    options.debug     = options.debug     || false;

    var tasks = [];
    for (var i in options.addresses) tasks.push(connectionTask(options.addresses[i], options.handlers, constructor, options));
    async.series(tasks, function (ws) {
        if (ws) return ws; // successfully connected

        // unable to connect to any of the given server, retry in options.timeout milliseconds
        if (options.debug) console.log('Retry in '+options.timeout+'ms');
        setTimeout(function () {
            constructor(options);
        }, options.timeout);
    });
}

module.exports = SmartSocket;