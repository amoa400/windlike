var Client = require('../lib/browser_client');

var tot = 0;

var pos = 0;
var create = function() {
	var client = new Client('http://localhost:1884?token=' + pos++);

	client.on('connected', function() {
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


