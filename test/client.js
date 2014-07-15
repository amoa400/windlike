var mqtt = require('mqtt');


var client = mqtt.connect('mqtt://localhost:1883?clientId=111222');
setTimeout(function() {
client.subscribe('messages');
client.on('message', function(topic, message) {
  console.log('A got -->  ' + message);
});
}, 50);


var client2 = mqtt.connect('mqtt://localhost:1883?clientId=aaabbb');
setTimeout(function() {
client2.subscribe('messages');
client2.on('message', function(topic, message) {
  console.log('B got -->  ' + message);
});
}, 50);


setInterval(function() {
	client2.unsubscribe('messages');
	if (Math.random() * 10 < 7) {
		client.publish('messages', 'A says: ' + Math.random() * 1000);
	} else {
		client2.publish('messages', 'B says: ' + Math.random() * 1000);
	}
}, 2000);

