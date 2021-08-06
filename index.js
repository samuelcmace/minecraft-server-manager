const https = require("https");
const fs = require("fs");
const child_process = require("child_process");

const express = require("express");

const server_root_dir = "server/";
const server_dir = "bedrock_test_server/";

// Setup Minecraft Server...
// const bedrock_server_archive_source = "https://minecraft.azureedge.net/bin-linux/bedrock-server-1.17.10.04.zip";
// const java_server_archive_source = "https://launcher.mojang.com/v1/objects/a16d67e5807f57fc4e550299cf20226194497dc2/server.jar";
//
// if(!fs.existsSync(server_root_dir))
// {
//   fs.mkdirSync(server_root_dir);
// }
//
// if(!fs.existsSync(server_root_dir + "bedrock_server.zip"))
// {
//   const server_archive = fs.createWriteStream(server_root_dir + "bedrock_server.zip");
//   const request = https.get(server_archive_source, function(response) {
//     console.log("Downloading the Minecraft Bedrock Server App...");
//     response.pipe(server_archive);
//     console.log("Success!");
//   });
// }
//
// if(!fs.existsSync(server_root_dir + "java_server.zip"))
// {
//   const server_archive = fs.createWriteStream(server_root_dir + "java_server.zip");
//   const request = https.get(server_archive_source, function(response) {
//     console.log("Downloading the Minecraft Java Server App...");
//     response.pipe(server_archive);
//     console.log("Success!");
//   });
// }
//
// if(!fs.existsSync(server_root_dir + server_dir))
// {
//   fs.mkdirSync(server_root_dir + server_dir);
// }

// Run Minecraft Server

var server_process = child_process.spawn("./bedrock_server",
  {cwd: server_root_dir + server_dir},
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

server_process.on('SIGTERM', function () {
  console.log("Stopping the server...");
  server_process.stdin.write("say Stopping the server...\n");
  server_process.stdin.write("stop\n");
  console.log("Success!");
});

// Create Web Manager

const index = fs.readFileSync("src/index.html");
const hostname = "127.0.0.1";
const web_port = 3000;

const app = express();
app.use(express.urlencoded({ extended:true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/src/index.html");
});

app.post("/", function(req, res) {
  var command = String(req.body.text);

  console.log("Web Interface Posted This Command: " + command);
  server_process.stdin.write(command + "\n");
});

app.listen(web_port, function() {
  console.log("server is running on port 3000");
});
