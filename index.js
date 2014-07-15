module.exports = require('./lib/windlike');

var fs = require('fs');

process.on('uncaughtException', function (err) {
  console.log("Error: ");
  console.error(err.stack);

  var error = '';
  error += '\n';
  error += new Date();
  error += '\n---------------------------------------------------------------------------------------------------\n';
  error += err.stack.toString();
  error += '\n===================================================================================================\n';

  fs.appendFile(__dirname + '/error.log', error);
});

