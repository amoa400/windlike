var http = require('http');
var fs = require('fs');

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



