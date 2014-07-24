var util = require('util');
var colors = require('colors');
var windlike = require('../../index');

var server = windlike.createServer();
util.log(('server start...').yellow);

var log = function(conn, action) {
	util.log((conn.id + ' ' + conn.token + ' ' + action).green);
}

server.on('connection', function(conn) {
	log(conn, 'connected');

	conn.on('subscribe', function(topic) {
		log(this, 'subscribe');
		this.subscribe(topic);
	});

	conn.on('unsubscribe', function(topic) {
		log(this, 'unsubscribe');
	});

	conn.on('publish', function(topic, message) {
		log(this, 'publish');
		this.publish(topic, message);
	});

	conn.on('close', function() {
		log(this, 'close');
	});

	conn.on('error', function() {
		log(this, 'error');
	});
});

setInterval(function() {
	util.log(('tot conns: ' + server.connsCount).red);
}, 1000);
