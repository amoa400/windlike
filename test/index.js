var util = require('util');
var windlike = require('../index');

var server = windlike.createServer();

var log = function(conn, action) {
	util.log((conn.id + ' ' + conn.token + ' ' + action).blue);
}

server.on('connection', function(conn) {
	log(conn, 'connected');
});

server.on('subscribe', function(conn, topic) {
	log(conn, 'subscribe');
	conn.subscribe(topic);
});

server.on('unsubscribe', function(conn, topic) {
	log(conn, 'unsubscribe');
});


server.on('publish', function(conn, topic, message) {
	log(conn, 'publish');
	conn.publish(topic, message);
});

server.on('close', function(conn) {
	log(conn, 'close');
});

server.on('error', function(conn) {
	log(conn, 'error');
});