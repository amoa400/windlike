var windlike = require('../../index');
var http = require('http');

var tot = 0;
var cnt = 0;
var server = windlike.createServer();

server.on('connection', function(conn) {
	tot++;
	cnt++;

	conn.on('close', function() {
		cnt--;
	});
});

setInterval(function() {
	//gc();
	console.log(tot);
	console.log(cnt);
	console.log(parseInt(process.memoryUsage().rss / 1024 /1024) + 'MB - ' + parseInt(process.memoryUsage().heapUsed / 1024 /1024) + 'MB - '  + parseInt(process.memoryUsage().heapTotal / 1024 /1024) + 'MB');
}, 500);

http.createServer(function(req, res) {
	gc();
	res.end('ok');
}).listen(8888);

