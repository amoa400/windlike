var mqtt = require('mqtt');


var client = mqtt.connect('mqtt://localhost:1883?clientId=111222');
client.subscribe('messages');
client.on('message', function(topic, message) {
  console.log('A got -->  ' + message);
});


var client2 = mqtt.connect('mqtt://localhost:1883?clientId=aaabbb');
client2.subscribe('messages');
client2.on('message', function(topic, message) {
  console.log('B got -->  ' + message);
});

setInterval(function() {
	if (Math.random() * 10 < 7) {
		client.publish('messages', 'A says: ' + Math.random() * 1000);
	} else {
		client2.publish('messages', 'B says: ' + Math.random() * 1000);
	}
}, 500);

