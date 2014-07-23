// requires
var util = require('util');
var events = require("events");

/**
 * MQTT Connection
 *
 */
var Connection = module.exports = function Connection() {
	this.old = {};
	this.server = {};
	this.active = '';
	this.id = '';
	this.token = '';
	this.topics = {};
	this.topicsCount = 0;
	this.time = new Date();
	this.prev = null;
	this.next = null;
}
util.inherits(Connection, events.EventEmitter);

//=====================================================================================

/**
 * subscribe topic
 *
 * @param {String} topic
 */
Connection.prototype.subscribe = function(topic) {
	// init
	if (typeof this.server.topics[topic] != 'object') {
		this.server.topics[topic] = {};
		this.server.topicsCount[topic] = 0;
	}

	// permission check
	if (this.server.topics[topic][this.id]) return;

	// subscribe this topic
	this.server.topics[topic][this.id] = 1;
	this.server.topicsCount[topic]++;
	this.topics[topic] = 1;
	this.topicsCount++;
}

/**
 * unsubscribe topic
 *
 * @param {String} topic
 */
Connection.prototype.ubsubscribe = function(topic) {
	// permission check
	if (this.server.topics[topic] == null || this.server.topics[topic][this.id] == null) return;

	// unsubscribe
	delete this.topics[topic];
	this.topicsCount--;
	delete this.server.topics[topic][this.id];
	this.server.topicsCount[topic]--;
}

/**
 * publish message
 *
 * @param {String} topic
 * @param {String} message
 */
Connection.prototype.publish = function(topic, message) {
	// publish topic
	for (var i in this.server.topics[topic]) {
		this.server.conns[i].old.publish({topic: topic, payload: JSON.stringify(message)});
	}
}

/** 
 * close this connection
 *
 */
Connection.prototype.close = function() {
	this._close();
}

//=====================================================================================

/**
 * event: subscribe
 *
 * @param {Object} packet
 */
Connection.prototype._subscribe = function(packet) {
	// deny multiple subscriptions
	if (packet.subscriptions.length != 1) return;

	// has subscribed
	if (this.server.topics[packet.subscriptions[0].topic] && this.server.topics[packet.subscriptions[0].topic][this.id]) {
		// TODO
		this.old.suback({granted: [packet.subscriptions[0].qos], messageId: packet.messageId});
		return;
	}

	// emit
	this.emit('subscribe', packet.subscriptions[0].topic);
}

/**
 * event: unsubscribe
 *
 * @param {Object} packet
 */
Connection.prototype._unsubscribe = function(packet) {
	// deny multiple subscriptions
	if (packet.unsubscriptions.length != 1) return;

	// get topic
	var topic = packet.unsubscriptions[0];

	// unsubscribe
	this.unsubscribe(topic);

	// emit
	this.emit('unsubscribe', topic);
}

/**
 * event: publish
 *
 * @param {Object} packet
 */
Connection.prototype._publish = function(packet) {
	// permission check
	if (this.server.topics[packet.topic] == null || this.server.topics[packet.topic][this.id] == null) return;

	// emit
	this.emit('publish', packet.topic, JSON.parse(packet.payload));
}

/**
 * event: connect
 *
 * @param {Object} packet
 */
Connection.prototype._connect = function(packet) {
	this.token = packet.clientId;
	this.old.connack({returnCode: 0});
	this.server.emit('connection', this);
}

/**
 * event: close
 *
 * @param {Object} packet
 */
Connection.prototype._close = function(packet) {
	// close stream
	this.old.stream.end();

	if (this.server.conns[this.id]) {
		// delete topics
		for (var i in this.topics) {
			delete this.server.topics[i][this.id];
			this.server.topicsCount[i]--;
		}

		// delete from queue
		this.prev.next = this.next;
		this.next.prev = this.prev;

		// delete connection
		delete this.server.conns[this.id];
		this.server.connsCount--;

		this.emit('close');
	}
}

/**
 * event: error
 *
 * @param {Object} packet
 */
Connection.prototype._error = function(packet) {
	// close will be emited after error ??
	this._close();
	this.emit('error', this, packet);
}

/**
 * event: pingreq
 *
 * @param {Object} packet
 */
Connection.prototype._pingreq = function(packet) {
	this.old.pingresp();
	this._active();
}

/**
 * update the active time of connection
 *
 */
Connection.prototype._active = function() {
	this.time = new Date();
	
	var prev = this.prev;
	var next = this.next;
	if (this.prev != null && this.next != null) {
		prev.next = next;
		next.prev = prev;
	}

	this.next = this.server.tail;
	this.prev = this.server.tail.prev;
	this.server.tail.prev.next = this;
	this.server.tail.prev = this;
}

