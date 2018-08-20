var fs = require("fs");
var mqtt = require("mqtt");
var config = require("./config");

var clientAndTopics = new Array();

fs.readdirSync(config.infoDir).forEach((file, index) => {
  var infoPath = config.infoDir + "/" + file;
  var mqttInfo = JSON.parse(fs.readFileSync(infoPath));
  let options = {
    clientId: mqttInfo.clientId,
    username: mqttInfo.username,
    password: mqttInfo.password
  };
  let client = mqtt.connect(
    "mqtt://" + mqttInfo.host[0] + ":" + mqttInfo.port,
    options
  );
  client.on("connect", () => {
    console.log('Client', mqttInfo.clientId, 'connected!');
    client.subscribe(mqttInfo.resources[2].topic);
  });
  client.on("message", (topic, message) => {
    console.log('Receive message:', message.toString(), ', from', topic);
  })
  clientAndTopics.push({
    client: client,
    tempTopic: mqttInfo.resources[0].topic,
    humidTopic: mqttInfo.resources[1].topic
  });
});

setInterval(() => {
  clientAndTopics.forEach(clientAndTopic => {
    let randTemp = Math.floor(Math.random() * 100 + 1);
    let randHumid = Math.floor(Math.random() * 100 + 1);
    let payload = '{"value": ' + randTemp + '}';
    clientAndTopic.client.publish(clientAndTopic.tempTopic, payload);
    console.log(" => Publish to", clientAndTopic.tempTopic, ",", payload);
    payload = '{"value": ' + randHumid + '}';
    clientAndTopic.client.publish(clientAndTopic.humidTopic, payload);
    console.log(" => Publish to", clientAndTopic.humidTopic, ",", payload);
  });
}, 1000);
