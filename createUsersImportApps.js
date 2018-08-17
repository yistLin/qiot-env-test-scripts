var Apis = require("./apis");

// Configurations
const config = {
  nasIP: "http://172.17.28.95",
  nasPort: 8080,
  adminUsername: "admin",
  adminPassword: "qnap1234",
  appConfigPath: "./rpi_indonisia_2018.json",
  numberOfUsers: 3
};
var apis = new Apis(config.nasIP, config.nasPort);

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

apis.loginUser(config.adminUsername, config.adminPassword).then(adminAccessToken => {
  createUsersImportAppsRecursively(adminAccessToken, config.numberOfUsers);
});
