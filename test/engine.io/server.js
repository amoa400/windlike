var engine = require('engine.io');

var tot = 0;
var cnt = 0;
var server = engine.listen(1884);

server.on('connection', function(conn) {
	tot++;
	cnt++;

	conn.on('close', function() {
		cnt--;
	});
});

setInterval(function() {
	gc();
	console.log(tot);
	console.log(cnt);
	console.log(parseInt(process.memoryUsage().rss / 1024 /1024) + 'MB');
}, 500);