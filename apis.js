var rp = require("request-promise-native");
var btoa = require("btoa");
var fs = require("fs");

module.exports = function(nasIP, nasPort) {
  var nasUrl = nasIP + ":" + nasPort;

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

  this.importApplication = function(accessToken, jsonPath) {
    var req = rp.post({
      uri: nasUrl + "/qiotapp/v1/iotapp/import/",
      headers: {
        "Access-Token": accessToken
      }
    });
    var form = req.form();
    form.append("fileUpload", fs.createReadStream(jsonPath));
    return req.then(res => res).catch(err => console.log("Error:", err));
  };

  this.getThingsList = function(accessToken) {
    var options = {
      method: "GET",
      uri: nasUrl + "/qiotapp/v1/things/",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken
      },
      json: true // Automatically stringifies the body to JSON
    };
    return rp(options)
      .then(res => res.result)
      .catch(err => console.log("Error:", err));
  };

  this.getMQTTConnectionInfo = function(accessToken, thingId) {
    var options = {
      method: "GET",
      uri: nasUrl + "/qiotapp/v1/things/" + thingId + "/mqttconnect/",
      headers: {
        "Access-Token": accessToken
      },
      json: true // Automatically stringifies the body to JSON
    };
    return rp(options)
      .then(res => res.result)
      .catch(err => console.log("Error:", err));
  };

  this.publishMessage = function(topic, thingId, accessToken, message) {
    var options = {
      method: "PUT",
      uri: nasIP + ":23000/resources/" + topic,
      headers: {
        "Content-Type": "application/json",
        RequesterId: thingId,
        "Access-Token": accessToken
      },
      body: message,
      json: true // Automatically stringifies the body to JSON
    };
    return rp(options)
      .then(res => console.log("message:", message, ", published to", topic))
      .catch(err => console.log("Error:", err));
  };

  this.changePassword = function(accessToken, oldPassword, newPassword) {
    var options = {
      method: "POST",
      uri: nasUrl + "/qiotapp/v1/users/password/change",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken
      },
      body: {
        oldPassword: btoa(oldPassword),
        newPassword: btoa(newPassword)
      },
      json: true // Automatically stringifies the body to JSON
    };
    return rp(options)
      .then(res => res.result)
      .catch(err => console.log("Error:", err));
  };
};
