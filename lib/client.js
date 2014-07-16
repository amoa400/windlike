var engine = require('engine.io-client');
var EventEmitter = require('events').EventEmitter;

/**
 * aa-io-client Socket
 *
 * @param {String} uri
 * @param {Object} options
 * @api public
 */
function Socket(uri, options) {
  // inherit from EventEmitter
  for (var i in EventEmitter.prototype) {
    this.__proto__[i] = EventEmitter.prototype[i];
  }
  // uri
  this.uri = uri;
  // options
  this.options = options;
  // status
  this.status = 'closed';
  // reconnect times
  this.times = 0;
  // message cache
  this.cache = [];
  // connect
  this.connect();
}
module.exports = Socket;

 /**
  * connect to server
  *
  * @api private
  */
Socket.prototype.connect = function() {
  // engine.io socket
  this.eSocket = engine(this.uri, this.options);
  // event
  this.eSocket.on('open', this.onOpen.bind(this));
  this.eSocket.on('message', this.onMessage.bind(this));
  this.eSocket.on('close', this.onClose.bind(this));
}

/**
 * reconnect to server
 *
 * @api private
 */
Socket.prototype.reconnect = function() {
  if (this.times >= 10) {
    this.cache = [];
    this.status = 'dead';
    this.emit('dead');
    return;
  }

  var wait = [100, 1000, 2000, 5000, 7000, 10000, 15000, 30000, 40000, 60000][this.times];
  this.times++;

  var self = this;
  setTimeout(function() {
    self.connect();
  }, wait);
}

/**
 * open a connection
 *
 * @param {Object} message
 * @api private
 */
Socket.prototype.onOpen = function() {
  this.emit('open');
  this.status = 'connected';

  // send cache message
  for (var i = 0; i < this.cache.length; i++) {
    this.send(this.cache[i]);
  }
  this.cache = [];
}

/**
 * closed
 *
 * @api private
 */
Socket.prototype.onClose = function(data, msg) {
  if (this.status == 'connected')
    this.emit('close');
  this.status = 'closed';
  this.reconnect();
}

/**
 * receive message from server
 *
 * @param {Object} message
 * @api private
 */
Socket.prototype.onMessage = function(data) {
  this.times = 0;
  
  // parse the data
  try {
    data = JSON.parse(data);
    if (typeof data !== 'object')
      throw new Error();
  }
  catch (e) {
    return;
  }

  // emit message
  this.emit('message', data);
}

/**
 * send message
 *
 * @param {Object} message
 * @api public
 */
Socket.prototype.send = function(data) {
  if (this.status == 'dead' || typeof data != 'object') return false;

  if (this.status == 'connected')
    this.eSocket.send(JSON.stringify(data));
  else
    this.cache.push(data);
}
