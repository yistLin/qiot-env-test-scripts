var rp = require("request-promise-native");
var btoa = require("btoa");

module.exports = function(nasUrl) {
  this.loginUser = function(username, password) {
    var options = {
      method: "POST",
      uri: nasUrl + "/qiotapp/v1/users/login/",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        username: username,
        password: btoa(password)
      },
      json: true // Automatically stringifies the body to JSON
    };
    return rp(options)
      .then(res => res.result.access_token)
      .catch(err => console.log("Error:", err));
  };

  this.createUser = function(adminAccessToken, username) {
    var options = {
      method: "POST",
      uri: nasUrl + "/qiotapp/v1/users/",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": adminAccessToken
      },
      body: {
        userName: username
      },
      json: true // Automatically stringifies the body to JSON
    };
    return rp(options)
      .then(res => res.result.password)
      .catch(err => console.log("Error:", err));
  };

  this.createApplication = function(accessToken, appName) {
    var options = {
      method: "POST",
      uri: nasUrl + "/qiotapp/v1/iotapp/",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken
      },
      body: {
        appname: appName,
        description: appName + " description",
        rulesdata: {
          ruleName: appName + "_rule",
          ruleDesc: appName + "_rule description",
          freeboardName: appName + "_dashboard",
          freeboardDesc: appName + "_dashboard description"
        }
      },
      json: true // Automatically stringifies the body to JSON
    };
    return rp(options)
      .then(res => res.result.id)
      .catch(err => console.log("Error:", err));
  };
};
