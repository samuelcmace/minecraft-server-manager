const EventEmitter = require('events');

const express = require("express");
const path = require("path");

module.exports = class WebServer extends EventEmitter {

  setRedirects() {
    this.app.get("/", function(req, res) { res.redirect("/console.html") });
    this.app.get("/console", function(req, res) { res.redirect("/console.html") });
    this.app.get("/login", function(req, res) { res.redirect("/login.html") });
  }

  setStaticRequests() {
    this.app.use("/include/", express.static(path.join(__dirname, "../", "src/", "include/")));
    this.app.use("/css/", express.static(path.join(__dirname, "../", "src/", "css/")));
  }

  setPostRequests() {
    this.app.post("/console.html", function(req, res) {
      console.log("Web Interface Posted This Command: " + String(req.body.text));
      this.emit("command", String(req.body.text));
    });

    this.app.post("/login.html", function(req, res) {
      var username = String(req.body.username);
      var password = String(req.body.password);

      console.log("Username: " + username);
      console.log("Password: " + password);
    });
  }

  setGetRequests()
  {
    this.app.get("/console.html", function(req, res) { res.sendFile(path.join(__dirname, "../", "src/", "console.html")); });
    this.app.get("/login.html", function(req, res) { res.sendFile(path.join(__dirname, "../", "src/", "login.html")); });
  }

  constructor(port) {
    super();
    this.process = undefined;
    this.web_port = port;

    this.app = express();

    this.app.use(express.urlencoded({ extended:true }));
    this.app.use(express.json());

    this.setStaticRequests();
    this.setGetRequests();
    this.setPostRequests();
    this.setRedirects();
  }

  listen() { this.app.listen(this.web_port, function() { console.log("Web Server started on port " + this.web_port); }); }
};
