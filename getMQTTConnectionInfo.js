var Apis = require("./apis");
var fs = require("fs");
var config = require("./config");

const infoDir = config.infoDir;
const users = JSON.parse(fs.readFileSync(config.userInfoJsonPath));
var apis = new Apis(config.nasIp, config.nasPort);

if (!fs.existsSync(infoDir)) {
  console.log("Folder:", infoDir, "doesn't exist. Create it now...");
  fs.mkdirSync(infoDir);
} else {
  console.log("Folder:", infoDir, "exists. Clean it now...");
  fs.readdirSync(infoDir).forEach((file, index) => {
    var infoPath = infoDir + "/" + file;
    fs.unlinkSync(infoPath);
  });
}

users.forEach(user => {
  apis.loginUser(user.username, user.password).then(accessToken => {
    console.log("  Login success =>", accessToken);
    apis
      .getThingsList(accessToken)
      .then(thingsList => thingsList[0].thingId)
      .then(thingId => {
        console.log("  First thing's ID =>", thingId);
        return apis.getMQTTConnectionInfo(accessToken, thingId);
      })
      .then(mqttInfo => {
        let filename = infoDir + "/resources-" + user.username + ".json";
        fs.writeFileSync(filename, JSON.stringify(mqttInfo));
      });
  });
});
