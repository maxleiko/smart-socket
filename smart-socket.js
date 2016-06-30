var WebSocket = require('ws'),
  async = require('async'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter;

var noop = function () {};

/**
 *
 * @param options { addresses: array, timeout: ms, loopBreak: ms, debug: boolean }
 * @constructor
 */
var SmartSocket = function (options) {
  this.id = null;
  this.wsConn = null;
  this.stopped = false;

  // Handlers are DEPRECATED in favor of EventEmitter logic
  var handlers   = options.handlers   || {};
  this.onopen    = handlers.onopen    || noop;
  this.onclose   = handlers.onclose   || noop;
  this.onerror   = handlers.onerror   || noop;
  this.onmessage = handlers.onmessage || noop;

  this.addresses = options.addresses || [];
  this.timeout   = options.timeout   || 10000;
  this.loopBreak = options.loopBreak || 2000;
  this.debug     = options.debug     || false;

  // prevent default EventEmitter behavior of exiting program when 'error' event are emitted
  this.on('error', noop);
};

// Inherit from EventEmitter
util.inherits(SmartSocket, EventEmitter);

/**
 * Starts the WebSocket connection tasks loop over given addresses
 */
SmartSocket.prototype.start = function () {
  var self = this;
  var tasks = self.addresses.map(function (address) {
    return function (cb) {
      if (self.debug) {
        console.log('Trying to connect to ws://' + address);
      }
      var that = this;
      that.wasOpen = false;
      var ws = new WebSocket('ws://' + address);
      var timeoutID = setTimeout(function () {
        try {
          if (self.debug) {
            console.log('Closing ws://' + address + ' connection attempt (smart-socket timeout)');
          }
          ws.close();
        } catch (ignore) {}
      }, self.timeout);

      ws.onopen = function (arg) {
        clearTimeout(timeoutID);
        if (self.debug) {
          console.log('Connection to ' + address + ' established.');
        }
        that.wasOpen = true;
        self.onopen.apply(ws, [ws, arg]);
        self.emit('open', ws, arg);
        cb(ws);
      };

      ws.onerror = function (arg) {
        clearTimeout(timeoutID);
        if (self.debug) {
          console.log('Error: ' + address, arg.message);
        }
        self.onerror.apply(ws, [ws, arg]);
        self.emit('error', ws, arg);
        cb(null); // try next
      };

      ws.onclose = function (arg) {
        clearTimeout(timeoutID);
        if (self.debug) {
          console.log('Close: ' + address, arg);
        }
        self.onclose.apply(ws, [ws, arg]);
        self.emit('close', ws, arg);

        if (that.wasOpen && !self.stopped) {
          connectionTasks();
        }
      };

      ws.onmessage = function (arg) {
        if (self.debug) {
          console.log('Message: ' + address, arg.data);
        }
        self.onmessage.apply(ws, [ws, arg]);
        self.emit('message', ws, arg);
      };
    };
  });

  /**
   * Tries to initiate a WebSocket connection with one of the given addresses
   * Once a connection is active, the loop stops (looping is done in series = one at a time)
   * If it is unable to connect to one of the given addresses, it will idle for this.loopBreak milliseconds
   * and then restart the connection loop (forever, unless SmartSocket.stop() is called)
   * @type {function(this:SmartSocket)}
   */
  var connectionTasks = function () {
    this.emit('loopStart');
    async.series(tasks, function (connectedWs) {
      if (connectedWs) {
        // successfully connected (abort connection loop)
        this.wsConn = connectedWs;
        this.emit('loopEnd');
        return;
      }

      // unable to connect to any of the given server
      if (!this.stopped) {
        // retry connection attempt in options.loopBreak milliseconds
        if (this.debug) {
          console.log('Retry in ' + this.loopBreak + 'ms');
        }
        setTimeout(connectionTasks, this.loopBreak);
        // notify that loop has ended
        this.emit('loopIn', this.loopBreak);
      }
    }.bind(this));
  }.bind(this);

  process.nextTick(connectionTasks);
};

/**
 * Prevents SmartSocket from retrying connection tasks in the future
 */
SmartSocket.prototype.stop = function () {
  this.stopped = true;
  clearTimeout(this.id);
  this.id = null;
  if (this.debug) {
    console.log('SmartSocket loop stopped');
  }
};

/**
 * Immediately close() connected WebSocket (does nothing if none connected)
 * @param stop {boolean} [optional, default = true] if true, close() will also call this.stop() and prevent SmartSocket from looping through connection tasks
 */
SmartSocket.prototype.close = function (stop) {
  if (typeof (stop) === 'undefined') {
    stop = true;
  }
  if (stop) {
    this.stop();
  }
  if (this.wsConn && this.wsConn.readyState === 1) {
    this.wsConn.close();
  }
};

module.exports = SmartSocket;
