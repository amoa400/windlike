var Client = require('../lib/browser-client');

var client = [];

for (var i = 0; i < 100; i++) {
	//client[i] = new Client('http://localhost:2883?token=' + i);
}


var mqtt = require('mqtt');

var client2 = [];

for (var i = 0; i < 500; i++) {
	client2[i] = mqtt.connect('mqtt://localhost:1883?clientId=b' + i);
}
