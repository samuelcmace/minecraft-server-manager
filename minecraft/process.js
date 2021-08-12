const child_process = require("child_process");
const path = require("path");

module.exports = class MinecraftProcess {
  constructor(type, server_directory) {
    this.server_directory = server_directory;
    this.server_type = type.toUpperCase();

    switch(this.server_type) {
      case "JAVA":
        this.command = "java -Xmx1024M -Xms1024M -jar server.jar nogui";
        break;
      case "BEDROCK":
        this.command = "LD_LIBRARY_PATH=. ./bedrock_server";
        break;
      default:
        console.error('Minecraft Server Failed to Start: Invalid Server Type: Expected "JAVA" or "BEDROCK" (Received: ' + this.server_type + ')');
        break;
    }

    this.server_process = child_process.exec(this.command,
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
    this.server_process.on('exit', function () {
      this.server_process.stdin.write("stop\n");
      this.server_process.stdin.end();
    });
  }
  runCommand(command) {
    this.server_process.stdin.write(command + "\n");
    this.server_process.stdin.end();
  }
}
