/*
var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://localhost:1883?clientId=mqtt_client');

client.subscribe('chat');

client.on('message', function(topic, message) {
  console.log('mqtt_client got: [' + topic + '] ' + message);
});

setInterval(function() {
	client.publish('chat', 'I\'m a message from mqtt_client.');
}, 1000);
*/
