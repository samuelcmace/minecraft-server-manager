const express = require("express");
const path = require("path");

const minecraft_module = require("./minecraft/process.js");

// Create Minecraft Server Instances
var bedrock_server = new minecraft_module("BEDROCK", path.join(__dirname, "server/bedrock_test_server"));
var java_server = new minecraft_module("JAVA", path.join(__dirname, "server/java_test_server"));

// Initalize Web Server
const web_app = express();
const web_port = 8080;

web_app.use(express.urlencoded({ extended:true }));
web_app.use(express.json());

// Set Redirects
web_app.get("/", function(req, res) { res.redirect("/console") });
web_app.get("/console.html", function(req, res) { res.redirect("/console") });
web_app.get("/login.html", function(req, res) { res.redirect("/login") });

// Set Static Content
web_app.use("/include/", express.static(path.join(__dirname, "src/", "include/")));
web_app.use("/css/", express.static(path.join(__dirname, "src/", "css/")));

// Set GET Requests
web_app.get("/console", function(req, res) { res.sendFile(path.join(__dirname, "src/", "console.html")); });
web_app.get("/login", function(req, res) { res.sendFile(path.join(__dirname, "src/", "login.html")); });

// Set POST Requests
web_app.post("/console", function(req, res) {
  var java_command = String(req.body.java_command);
  var bedrock_command = String(req.body.bedrock_command);

  console.log("Bedrock Web Interface Posted This Command: " + bedrock_command);
  console.log("Java Web Interface Posted This Command: " + java_command);

  bedrock_server.runCommand(bedrock_command);
  java_server.runCommand(java_command);
});

web_app.post("/login.html", function(req, res) {
  var username = String(req.body.username);
  var password = String(req.body.password);

  console.log("Username: " + username);
  console.log("Password: " + password);
});

// Listen for Requests
web_app.listen(web_port, function() { console.log("Web Server started on port " + web_port); });
