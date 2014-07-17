var util = require('util');
var windlike = require('../../index');

var server = windlike.createServer();
util.log(('server start...').yellow);

var log = function(conn, action) {
	return;
	util.log((conn.id + ' ' + conn.token + ' ' + action).green);
}

server.on('connection', function(conn) {
	console.log('connected: ' + conn.token);
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
	//log(conn, 'publish');
	conn.publish(topic, message);
});

server.on('close', function(conn) {
	console.log('closed: ' + conn.token);
	log(conn, 'close');
});

server.on('error', function(conn) {
	log(conn, 'error');
});

setInterval(function() {
	util.log(('tot: ' + server.connsCount).green);
}, 1000);
