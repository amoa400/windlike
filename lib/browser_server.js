// requires
var engine = require('engine.io');
var windlike = require('./windlike');
var Connection = require('./browser_connection');

/**
 * Browser Server
 *
 */
var Server = module.exports = function Server(options) {
	this.port = options.port || 1884;
	this.mqttPort = options.mqttPort || 1883;

	this.old = engine.listen(options.port);
	this.old.on('connection', this._init.bind(this));
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
	conn.mqtt = windlike.createClient(this.mqttPort, 'localhost', {clientId: oldConn.request._query.token});

	// event emitter
	oldConn.on('message', conn._message.bind(conn));
	oldConn.on('close', conn._close.bind(conn));

	conn.mqtt.on('message', conn._mqttMessage.bind(conn));
	conn.mqtt.on('close', conn._mqttClose.bind(conn));
}

