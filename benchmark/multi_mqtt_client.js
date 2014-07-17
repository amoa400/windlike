var mqtt = require('mqtt');

var tot = 0;

var pos = 0;
var create = function() {
	var client = mqtt.connect('mqtt://localhost:1883?clientId=' + pos++);

	client.on('connect', function() {
		tot++;
	});

	setImmediate(create);
}

create();

setInterval(function() {
	console.log(tot + ' conns max concurrency');
}, 1000);

// get result
setTimeout(function() {
	console.log('result: ' + tot + ' conns max concurrency');
	process.exit(0);
}, 1000 * 20);