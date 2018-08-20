var Apis = require("./apis");
var fs = require("fs");

// Configurations
const config = require("./config");
var apis = new Apis(config.nasIp, config.nasPort);

var userAndPasswords = new Array();

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

function createUsersImportAppsRecursively(adminAccessToken, i) {
  return new Promise((resolve, reject) => {
    if (i === 0) resolve("To the very end of resursive function.");
    else {
      let newUsername = "user" + i.pad(5);
      createUsersImportAppsRecursively(adminAccessToken, i - 1)
        .then(() => apis.createUser(adminAccessToken, newUsername))
        .then(password => {
          console.log("\n  New user created:", newUsername, "/", password);
          userAndPasswords.push({ username: newUsername, password: password });
          return apis.loginUser(newUsername, password);
        })
        .then(accessToken => {
          console.log("  Access token got =>", accessToken);
          return apis.importApplication(accessToken, config.appConfigPath);
        })
        .then(appName => {
          console.log("  App created =>", appName);
          resolve("User " + newUsername + " is created.");
        })
        .catch(err => {
          console.log("Error:", err);
          reject("Something happened.");
        });
    }
  });
}

apis
  .loginUser(config.adminUsername, config.adminPassword)
  .then(adminAccessToken => createUsersImportAppsRecursively(adminAccessToken, config.numberOfUsers))
  .then(() => {
    if (fs.existsSync(config.userInfoJsonPath)) {
      fs.unlinkSync(config.userInfoJsonPath);
    }
    fs.writeFileSync(config.userInfoJsonPath, JSON.stringify(userAndPasswords));
  });
