// requires
var engine = require('engine.io');
var windlike = require('./windlike');
var Connection = require('./browser_connection');

/**
 * Browser Server
 *
 */
var Server = module.exports = function Server() {
	this.old = engine.listen(2883);
	this.old.on('connection', this._init);
}

/**
 * new connection
 *
 * @param {Object} old connection
 */
Server.prototype._init = function(oldConn) {
	// create new connection
	var conn = new Connection();
	conn.old = oldConn;
	conn.mqtt = windlike.createClient(1883, 'localhost', {clientId: oldConn.request._query.token});

	// event emitter
	oldConn.on('message', conn._message.bind(conn));
	oldConn.on('close', conn._close.bind(conn));

	conn.mqtt.on('message', conn._mqttMessage.bind(conn));
	conn.mqtt.on('close', conn._mqttClose.bind(conn));
}

