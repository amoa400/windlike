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
	util.log(('memory used: ' + parseInt(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB').yellow);
}, 1000);

process.on('uncaughtException', function (err) {
	util.log('!!! Error !!!'.red);
  console.error(err);
});
