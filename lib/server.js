// requires
var util = require('util');
var events = require("events");
var mqtt = require('mqtt');
var Connection = require('./connection');
var BrowserServer = require('./browser_server');

/**
 * MQTT Server
 *
 */
var Server = module.exports = function Server() {
	var self = this;

	// variables
	this.conns = {};
	this.connsCount = 0;
	this.topics = {};
	this.topicsCount = {};
	this.port = 1883;
	this.deadTime = 60 * 3;

	this.head = new Connection();
	this.head.id = 'head';
	this.tail = new Connection();
	this.tail.id = 'tail';
	this.head.next = this.tail;
	this.tail.prev = this.head;

	// create mqtt server
	this.server = mqtt.createServer(function(conn) {
		// new connection
		self._init(conn);
	}).listen(this.port);

	// create browser server
	this.bserver = new BrowserServer();

	// clean dead connections
	setInterval(this._clean.bind(this), 30000);
	
	// monitor
	// setInterval(this._monitor.bind(this), 1000);
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
	conn._active();

	// add to the container
	this.conns[conn.id] = conn;
	this.connsCount++;

	// event emitter
	oldConn.on('connect', conn._connect.bind(conn));
	oldConn.on('close', conn._close.bind(conn));
	oldConn.on('error', conn._error.bind(conn));

	oldConn.on('pingreq', conn._pingreq.bind(conn));
	oldConn.on('subscribe', conn._subscribe.bind(conn));
	oldConn.on('unsubscribe', conn._unsubscribe.bind(conn));
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
 * clean dead connections
 *
 */
Server.prototype._clean = function() {
	var cntTime = parseInt(new Date().getTime() / 1000);
	var p = this.head.next;
	while (p != this.tail) {
		var time = parseInt(p.time.getTime() / 1000);
		if (cntTime - time > this.deadTime) {
			p._close();
			p = p.next;
		} else
		break;
	}
}

/**
 * monitor
 *
 */
Server.prototype._monitor = function() {
	util.log('-----------------------------------------------------------------------------'.grey);
	util.log(('---  Count: ' + this.connsCount).red);
	for (var i in this.conns) {
		util.log(('---  Connection: ' + this.conns[i].id).yellow);
	}

	var queue = '';
	var p = this.head;
	while (p != this.tail) {
		queue += p.id + ' > ';
		p = p.next;
	}
	queue += 'tail';
	util.log(('---  Queue: ' + queue).green);
}








