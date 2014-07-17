var fs = require('fs');
var browserify = require('browserify');
var uglifyjs = require('uglify-js');

console.log('browserify...');
var b = browserify();
b.add('./browser.js');
b.bundle(function(err, src) {
	fs.writeFileSync('./temp.js', src);
	console.log('minify...');
	var mini = uglifyjs.minify('./temp.js');
	fs.writeFileSync('../example/browser_chat/windlike.js', mini.code);
	fs.unlinkSync('./temp.js');
	console.log('done...');
});

