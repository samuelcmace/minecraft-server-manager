const path = require("path");

const web_module = require("./web/web.js");
const minecraft_module = require("./minecraft/process.js");

var minecraft_instance = new minecraft_module("BEDROCK", path.join(__dirname, "server/bedrock_test_server"));
var web_instance = new web_module(8080);

web_instance.on("command", function(command) { minecraft_instance.runCommand(this.command); });

web_instance.listen();
