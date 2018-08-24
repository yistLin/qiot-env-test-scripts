var Apis = require("./apis");

const config = require("./config");

// Configurations
var apis = new Apis(config.nasIp, config.nasPort);

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

apis.loginUser(config.adminUsername, config.adminPassword).then(adminAccessToken => {
  for (let i = 1, p = Promise.resolve(); i <= config.numberOfUsers; i++) {
    p = p.then(_ => new Promise(resolve => {
      let newUsername = "user" + i.pad(5);
      apis.createUser(adminAccessToken, newUsername)
        .then(password => {
          console.log("\nNew user created:", newUsername, "/", password);
          return apis
            .loginUser(newUsername, password)
            .then(accessToken => apis.changePassword(accessToken, password, "password"))
            .then(msg => {
              console.log(msg);
              resolve("User " + newUsername + " is created.");
            });
        })
    }));
  }
});
