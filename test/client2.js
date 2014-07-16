var Client = require('../lib/browser-client');


var client = new Client('http://localhost:2883?token=123');

client.on('connected', function() {
	client.subscribe('chat');
	client.on('message', function(topic, message) {
		console.log(topic);
		console.log(message);
		client.publish('chat', '123456');
	});
});
