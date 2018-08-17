var Apis = require("./apis");

// Configurations
const config = {
  nasUrl: "http://172.17.28.95:8080",
  adminUsername: "admin",
  adminPassword: "qnap1234",
  numberOfUsers: 3
};
var apis = new Apis(config.nasUrl);

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

function createUsersAndAppsRecursively(adminAccessToken, i) {
  return new Promise((resolve, reject) => {
    if (i === 0) resolve("To the very end of resursive function.");
    else {
      let newUsername = "user" + i.pad(5);
      createUsersAndAppsRecursively(adminAccessToken, i - 1)
        .then(() => apis.createUser(adminAccessToken, newUsername))
        .then(password => {
          console.log("  New user created:", newUsername, "/", password);
          return apis.loginUser(newUsername, password);
        })
        .then(accessToken => {
          console.log("  Access token got =>", accessToken);
          return apis.createApplication(accessToken, "app");
        })
        .then(appId => {
          console.log("  IoT Application created with ID =>", appId, "\n");
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
  createUsersAndAppsRecursively(adminAccessToken, config.numberOfUsers);
});
