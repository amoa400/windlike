// requires
var mqtt = require('mqtt');
var Server = require('./server');

/**
 * create an mqtt server
 *
 * @param {Function} listener
 * @return {Object} Server
 */
exports.createServer = function() {
	return new Server();
}

/**
 * create an mqtt client
 *
 * @param {Number} broker port
 * @param {String} broker host
 * @param {Object} see MqttClient#constructor
 * @return {Object} client
 */
exports.createClient = mqtt.createClient;
