var mqtt = require('mqtt');

var tot = 0;
var cnt = 0;
var server = mqtt.createServer(function(conn) {
	tot++;
	cnt++;

	conn.on('close', function() {
		cnt--;
	});

}).listen(1883);

setInterval(function() {
	gc();
	console.log(tot);
	console.log(cnt);
	console.log(parseInt(process.memoryUsage().rss / 1024 /1024) + 'MB');
}, 500);