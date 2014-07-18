// requires
var should = require('should');
var mqtt = require('mqtt');
var Server = require('../lib/server');

describe('Server', function() {
	it('should clean dead connections', function(done) {
		var server = new Server();

		var client = [];
		for (var i = 0; i < 10; i++) {
			client[i] = mqtt.connect('mqtt://localhost:1883?clientId=mqtt_client');
		}

		setTimeout(function() {
			var now = new Date();
			server.deadTime = 5;
			var tot = 10;
			for (var i in server.conns) {
				server.conns[i].time = new Date(now - tot * 1000);
				tot--;
			}
			server._clean();
			server.connsCount.should.approximately(5, 1);
			done();
		}, 500);
	});
});



