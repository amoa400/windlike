// requires
var util = require('util');
var events = require("events");
var mqtt = require('mqtt');
var Connection = require('./connection');

var colors = require('colors');

/**
 * MQTT Server
 *
 * @param listener
 */
var Server = module.exports = function Server(listener) {
	var self = this;

	// params
	// TODO
	listener = (typeof listener == 'function') ? listener  : function() {};

	// variables
	this.conns = {};
	this.connsCount = 0;
	this.topics = {};
	this.topicsCount = 0;
	this.port = 1883;

	// create mqtt server
	this.server = mqtt.createServer(function(conn) {
		// new connection
		self._init(conn);
	}).listen(this.port);

	setInterval(this.monitor.bind(this), 1000);
}
util.inherits(Server, events.EventEmitter);


/**
 * new connection
 *
 * @param {Object} old connection
 */
Server.prototype._init = function(oldConn) {
	// create new connection
	var conn = new Connection();
	conn.old = oldConn;
	conn.server = this;
	conn.active = true;
	conn.id = this._generateId();
	conn.time = parseInt(new Date().getTime() / 1000);

	// add to the container
	this.conns[conn.id] = conn;
	this.connsCount++;

	// event emitter
	oldConn.on('connect', conn._connect.bind(conn));
	oldConn.on('disconnect', conn._disconnect.bind(conn));
	oldConn.on('close', conn._close.bind(conn));
	oldConn.on('pingreq', conn._pingreq.bind(conn));
	oldConn.on('error', conn._error.bind(conn));
	oldConn.on('subscribe', conn._subscribe.bind(conn));
	oldConn.on('publish', conn._publish.bind(conn));
}

/**
 * generate connection id
 *
 * @return {String} id
 */
Server.prototype._generateId = function() {
	var id = '';
	for (var i = 0; i < 16; i++) {
		id += String.fromCharCode(65 + parseInt(Math.random() * 26));
	}
	return id;
}

/**
 * monitor
 *
 */
Server.prototype.monitor = function() {
	util.log('-----------------------------------------------------------------------------'.grey);
	util.log(('---  Count: ' + this.connsCount).red);
	for (var i in this.conns) {
		util.log(('---  Connection: ' + this.conns[i].id).yellow);
	}
}



