var engine = require('engine.io-client');

setInterval(function() {
	var token = parseInt(Math.random() * 1000);
	var client = engine('http://localhost:1884?token=' + token);
}, 10);