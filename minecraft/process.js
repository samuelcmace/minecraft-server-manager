const child_process = require("child_process");
const path = require("path");

module.exports = class MinecraftProcess {
  java_run() {
    this.process = child_process.spawn("java -jar server.jar",
      {cwd: this.server_directory},
      function(error, stdout, stderr) {
        if(error)
        {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          console.log('Signal received: ' + error.signal);
        }
        console.log('Child Process STDOUT: ' + stdout);
        console.log('Child Process STDERR: ' + stderr);
      }
    );

    this.process.on('SIGTERM', function () {
      console.log("Stopping the server...");
      this.process.stdin.write("stop\n");
      console.log("Success!");
    });
  }
  bedrock_run() {
    this.process = child_process.spawn("./bedrock_server",
      {cwd: this.server_directory},
      {env: "LD_LIBRARY_PATH=" + __dirname},
      function(error, stdout, stderr) {
        if(error)
        {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          console.log('Signal received: ' + error.signal);
        }
        console.log('Child Process STDOUT: ' + stdout);
        console.log('Child Process STDERR: ' + stderr);
      }
    );

    this.process.on('SIGTERM', function () {
      console.log("Stopping the server...");
      this.process.stdin.write("stop\n");
      console.log("Success!");
    });
  }
  runCommand(command) {
    this.process.stdin.write(command + "\n");
  }
  constructor(type, server_directory) {
    this.process = undefined;
    this.server_directory = server_directory;
    this.serverType = type.toUpperCase();

    if(this.serverType === "JAVA")
    {
      this.java_run();
    }
    else if(this.serverType === "BEDROCK")
    {
      this.bedrock_run();
    }
    else {
      console.error('Error: Invalid Minecraft Server Type: Expected "JAVA" or "BEDROCK"');
    }
  }
}
