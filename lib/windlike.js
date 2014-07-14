// requires
var Server = require('./server');

/**
 * create mqtt server
 *
 * @param {Function} listener
 * @return {Object} Server
 */
exports.createServer = function(listener) {
	return new Server(listener);
}