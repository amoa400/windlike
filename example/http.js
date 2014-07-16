var http = require('http');
var fs = require('fs');
var windlike = require('../index');

// realtime connection server
var server = windlike.createServer();

server.on('subscribe', function(conn, topic, qos, messageId) {
	conn.subscribe(topic, qos, messageId);
});

server.on('publish', function(conn, topic, message) {
	conn.publish(topic, message);
});

// http server
http.createServer(function(req, res) {
	if (req.url == '/windlike.js') {
		fs.readFile('windlike.js', function(err, data) {
			res.setHeader("Content-Type", "application/x-javascript");
			res.write(data);
			res.end();
		});
	} else {
		fs.readFile('index.html', function(err, data) {
			res.setHeader("Content-Type", "text/html");
			res.write(data);
			res.end();
		});
	}
}).listen(8888);


