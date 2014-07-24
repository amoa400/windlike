var http = require('http');
var fs = require('fs');
var windlike = require('../../index');

// realtime connection server
var server = windlike.createServer();

server.on('connection', function(conn) {
	conn.on('subscribe', function(topic) {
		this.subscribe(topic);
	});

	conn.on('publish', function(topic, message) {
		this.publish(topic, message);
	});
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



