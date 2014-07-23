// requires
var util = require('util');
var events = require("events");
var engine = require('engine.io-client');

/**
 * Browser Client
 *
 */
var Client = module.exports = function Connection(uri) {
	this.old = {};
	this.cache = [];
	this.uri = uri;
	this.status = 'closed';
	this.times = 0;

	this._connect();
}
util.inherits(Client, events.EventEmitter);

//=====================================================================================

/**
 * subscribe a topic
 *
 * @param {String} topic
 */
Client.prototype.subscribe = function(topic) {
  this._send({
    cmd: 'subscribe', 
    topic: topic,
    options: {qos: 0}
  });
}

/**
 * unsubscribe a topic
 *
 * @param {String} topic
 */
Client.prototype.unsubscribe = function(topic) {
  this._send({
    cmd: 'unsubscribe', 
    topic: topic
  });
}

/**
 * publish a message
 *
 * @param {String} topic
 * @param {String} message
 */
Client.prototype.publish = function(topic, message) {
  this._send({
    cmd: 'publish', 
    topic: topic,
    message: message,
    options: {qos: 0}
  });
}

//=====================================================================================

/**
 * connect to server
 *
 * @param {String} uri
 */
Client.prototype._connect = function() {
	// create a new connection
	this.old = engine(this.uri);

	// event emitter
	this.old.on('open', this._open.bind(this));
	this.old.on('message', this._message.bind(this));
	this.old.on('close', this._close.bind(this));
}

/**
 * reconnect to server
 *
 */
Client.prototype._reconnect = function() {
	if (this.status == 'daed') return;
  if (this.times >= 10) {
    this.status = 'dead';
    this.emit('dead');
    return;
  }

  var wait = [100, 1000, 2000, 5000, 7000, 10000, 15000, 30000, 40000, 60000][this.times];
  this.times++;

  var self = this;
  setTimeout(function() {
    self._connect();
  }, wait);
}

/**
 * event: open
 *
 */
Client.prototype._open = function() {
  // status
  this.status = 'connected';
  this.emit('connected');

  // send cache message
  for (var i = 0; i < this.cache.length; i++) {
    this._send(this.cache[i]);
  }
  this.cache = [];
  this.times = 0;
}

/**
 * event: closed
 *
 */
Client.prototype._close = function() {
  if (this.status == 'connected')
    this.emit('closed');
  this.status = 'closed';
  this._reconnect();
}

/**
 * event: message
 *
 */
Client.prototype._message = function(message) {
  this.times = 0;
  
  // parse the message
  try {
    message = JSON.parse(message);
    if (typeof message !== 'object')
      throw new Error();
    message.message = JSON.parse(message.message);
    if (typeof message !== 'object')
      throw new Error();
  }
  catch (e) {
    return;
  }

  // emit message
  this.emit('message', message.topic, message.message);
}

/**
 * send message
 *
 * @param {Object} message
 */
Client.prototype._send = function(message) {
  if (this.status == 'dead' || typeof message != 'object') return;

  if (this.status == 'connected')
    this.old.send(JSON.stringify(message));
  else
    this.cache.push(message);
}
