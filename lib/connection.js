// requires
var util = require('util');
var events = require("events");

/**
 * MQTT Connection
 *
 */
var Connection = module.exports = function Connection() {
	this.old = {};
	this.id = '';
	this.token = '';
	this.time = '';
	this.active = '';
}
util.inherits(Connection, events.EventEmitter);

// TODO 将连接和主题关联，以便于统计数据


/**
 * subscribe topic
 *
 * @param {String} topic
 */
Connection.prototype.subscribe = function(topic, qos, messageId) {
	if (typeof this.server.topics[topic] != 'object')
		this.server.topics[topic] = {};
	this.server.topics[topic][this.id] = 1;
	this.old.suback({granted: [qos], messageId: messageId});
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
		if (this.server.conns[i] == null) {
			delete this.server.topics[topic][i];
			continue;
		}
		this.server.conns[i].old.publish({topic: topic, payload: message});
	}
}

/**
 * event: subscribe
 *
 * @param {Object} packet
 */
Connection.prototype._subscribe = function(packet) {
	// deny multiple subscriptions
	if (packet.subscriptions.length != 1) return;

	// emit
	this.server.emit('subscribe', this, packet.subscriptions[0].topic, packet.subscriptions[0].qos, packet.messageId);
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
	this.server.emit('publish', this, packet.topic, packet.payload);
}

/**
 * event: connect
 *
 * @param {Object} packet
 */
Connection.prototype._connect = function(packet) {
	this.token = packet.clientId;
	this.old.connack({returnCode: 0});
}

/**
 * event: pingreq
 *
 * @param {Object} packet
 */
Connection.prototype._pingreq = function(packet) {
	this.old.pingresp();
}

/**
 * event: disconnect
 *
 * @param {Object} packet
 */
Connection.prototype._disconnect = function(packet) {
	this.old.stream.end();
}

/**
 * event: close
 *
 * @param {Object} packet
 */
Connection.prototype._close = function(packet) {
	delete this.server.conns[this.id];
	this.server.connsCount--;
}

/**
 * event: error
 *
 * @param {Object} packet
 */
Connection.prototype._error = function(packet) {
	this.old.stream.end();
	this.server.emit('error', packet);
}

