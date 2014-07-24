var Client = require('../lib/browser_client');

var maxConns = 1500; // depens on your enviroment


var client = [];
var clientCount = 0;
var messageCount = 0;
var realClientCount = 0;

// receive message
var receive = function(topic, message) {
	messageCount++;
}

// add max conns
for (var i = 0; i < maxConns; i++) {
	client[i] = new Client('http://localhost:1884?token=' + i);
	client[i].on('connected', function() {
		realClientCount++;
		this.subscribe('test');
	});
	client[i].on('closed', function() {
		realClientCount--;
	});
	client[i].on('message', receive);
}
clientCount = maxConns;

// random add conn
setInterval(function() {
	if (Math.random() * 10 < 8) return;

	client[clientCount] = new Client('http://localhost:1884?token=' + clientCount);
	client[clientCount].on('connected', function() {
		realClientCount++;
		this.subscribe('test');
	});
	client[clientCount].on('closed', function() {
		realClientCount--;
	});
	client[clientCount].on('message', receive);
	clientCount++;
}, 5000);

// random publish message
setInterval(function() {
	messageCount = 0;
	var id = parseInt(Math.random() * clientCount);
	client[id].publish('test', Math.random().toString());
}, 10000);

// count message
var countRes = 0;
var countTimes = 0;
setInterval(function() {
	console.log('tot client: ' + clientCount);
	console.log('tot client real: ' + realClientCount);
	console.log('tot message: ' + messageCount);
	console.log('');

	if (messageCount != 0) {
		countRes += messageCount / realClientCount;
		countTimes++;
	}
}, 2000);

// get result
setTimeout(function() {
	if (countTimes != 0)
	console.log('stability: ' + (countRes / countTimes));
	process.exit(0);
}, 1000 * 120);






