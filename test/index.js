var windlike = require('../index');

var server = windlike.createServer();

server.on('subscribe', function(conn, topic, qos, messageId) {
	conn.subscribe(topic, qos, messageId);
});

server.on('publish', function(conn, topic, message) {
	conn.publish(topic, message);
});