const express = require("express");
const path = require("path");

const minecraft_module = require("./minecraft/process.js");

var minecraft_instance = new minecraft_module("BEDROCK", path.join(__dirname, "server/bedrock_test_server"));

const web_app = express();
const web_port = 8080;

web_app.use(express.urlencoded({ extended:true }));
web_app.use(express.json());

// Set Redirects
web_app.get("/", function(req, res) { res.redirect("/console.html") });
web_app.get("/console", function(req, res) { res.redirect("/console.html") });
web_app.get("/login", function(req, res) { res.redirect("/login.html") });

// Set Static Content
web_app.use("/include/", express.static(path.join(__dirname, "src/", "include/")));
web_app.use("/css/", express.static(path.join(__dirname, "src/", "css/")));

// Set GET Requests
web_app.get("/console.html", function(req, res) { res.sendFile(path.join(__dirname, "src/", "console.html")); });
web_app.get("/login.html", function(req, res) { res.sendFile(path.join(__dirname, "src/", "login.html")); });

// Set POST Requests
web_app.post("/console.html", function(req, res) {
  var command = String(req.body.text);
  console.log("Web Interface Posted This Command: " + command);
  minecraft_instance.runCommand(command);
});

web_app.post("/login.html", function(req, res) {
  var username = String(req.body.username);
  var password = String(req.body.password);

  console.log("Username: " + username);
  console.log("Password: " + password);
});

// Listen for Requests
web_app.listen(web_port, function() { console.log("Web Server started on port " + web_port); });
