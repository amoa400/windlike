var mqtt = require('mqtt');

setInterval(function() {
	var token = parseInt(Math.random() * 1000);
	var client = mqtt.createClient(1883, 'localhost', {clientId: token.toString()});
}, 10);
