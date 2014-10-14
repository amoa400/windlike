var engine = require('../../lib/browser_client');

setInterval(function() {
	var token = parseInt(Math.random() * 1000);
	var client = new engine('http://localhost:1884?token=' + token);
}, 10);
