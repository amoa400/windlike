var mqtt = require('../');
var client = mqtt.createClient(1883, "localhost");

var sent = 0;
var interval = 5000;

function count() {
  console.log("sent/s", sent / interval * 1000);
  sent = 0;
  setTimeout(count, interval);
}

function publish() {
  sent++;
  client.publish("test", "payload");
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