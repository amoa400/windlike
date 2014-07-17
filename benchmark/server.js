var util = require('util');
var colors = require('colors');
var windlike = require('../index');

var server = windlike.createServer();
util.log(('server start...').yellow);

var cache = {};
var log = function(conn, action) {
	if (cache[action] && parseInt((new Date().getTime() - cache[action].getTime())) < 5000) return;

	cache[action] = new Date();

	util.log((conn.id + ' ' + conn.token + ' ' + action).green);
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

setInterval(function() {
	util.log(('tot conns: ' + server.connsCount).red);
}, 1000);

process.on('uncaughtException', function (err) {
	util.log('!!! Error !!!'.red);
  console.error(err);
});
