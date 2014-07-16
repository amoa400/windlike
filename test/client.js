var mqtt = require('mqtt');


var client = mqtt.connect('mqtt://localhost:1883?clientId=111222');
setTimeout(function() {
client.subscribe('chat');
client.on('message', function(topic, message) {
  console.log('A got -->  ' + message);
});
}, 50);


/*
var client2 = mqtt.connect('mqtt://localhost:1883?clientId=aaabbb');
setTimeout(function() {
client2.subscribe('chat');
client2.on('message', function(topic, message) {
  console.log('B got -->  ' + message);
});
}, 50);
*/


setInterval(function() {
	client.publish('chat', '[模拟移动端] 我是来自移动端的消息...');

	/*
	if (Math.random() * 10 < 7) {
		client.publish('chat', 'A says的: ' + Math.random() * 1000);
	} else {
		client2.publish('chat', 'B says: ' + Math.random() * 1000);
	}
	*/
}, 5000);

