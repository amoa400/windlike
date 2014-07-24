var mqtt = require('../');
var client = mqtt.createClient(1883, "localhost");

var sent = 0;
var interval = 1000;

var res = 0;
var resCount = 0;

function count() {
  if (sent / interval * 1000 > 10) {
    res += sent / interval * 1000;
    resCount++;
  }
  console.log("sent/s", sent / interval * 1000);
  sent = 0;
  setTimeout(count, interval);
}

function publish() {
  sent++;
  client.publish("test", JSON.stringify("payload"));
  setImmediate(publish);
}

client.on("connect", function() {
  client.subscribe("test");
  publish();
  count();
});

client.on("error", function() {
  console.log("reconnect!");
  client.stream.end();
});

// get result
setTimeout(function() {
  console.log("result: sent/s", res / resCount);
  process.exit(0);
}, 1000 * 20);