var mqtt = require('../');

var client = mqtt.createClient(1883);
var counter = 0;
var interval = 1000;

var res = 0;
var resCount = 0;

function count() {
  if (counter / interval * 1000 > 10) {
    res += counter / interval * 1000;
    resCount++;
  }
  console.log("msg/s", counter / interval * 1000);
  counter = 0;
  setTimeout(count, interval);
}

client.on('connect', function() {
  count();
  this.subscribe('test');
  this.on("message", function() {
    counter++;
  });
});

// get result
setTimeout(function() {
  console.log("result: msg/s", res / resCount);
  process.exit(0);
}, 1000 * 15);
