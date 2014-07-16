// requires
var util = require('util');
var events = require("events");

/**
 * Browser Connection
 *
 */
var Connection = module.exports = function Connection() {
	this.old = {};
	this.mqtt = {};
}
util.inherits(Connection, events.EventEmitter);

/**
 * event: message
 *
 * @param {Object} packet
 */
Connection.prototype._message = function(packet) {
	packet = JSON.parse(packet);

	switch(packet.cmd) {
		case 'subscribe':
			this.mqtt.subscribe(packet.topic, packet.options);
			break;
		case 'unsubscribe':
			this.mqtt.unsubscribe(packet.topic);
			break;
		case 'publish':
			this.mqtt.publish(packet.topic, packet.message, packet.options);
			break;
	}
}

/**
 * event: close
 * TODO 内存泄露问题
 *
 */
Connection.prototype._close = function() {
	this.mqtt.end();
	this.old.close();
}

/**
 * event: mqtt message
 *
 */
Connection.prototype._mqttMessage = function(topic, message) {
	console.log(JSON.stringify({topic: topic, message: message}));
	this.old.send(JSON.stringify({topic: topic, message: message}));
}

/**
 * event: mqtt close
 * TODO 内存泄露问题
 *
 */
Connection.prototype._mqttClose = function() {
	this.mqtt.end();
	this.old.close();
}



