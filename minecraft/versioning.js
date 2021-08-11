const minecraft_server_root_dir = "server/";
const bedrock_server_test_dir = "bedrock_test_server/";
const java_server_test_dir = "java_test_server/";

const bedrock_server_archive_source = "https://minecraft.azureedge.net/bin-linux/bedrock-server-1.17.10.04.zip";
const java_server_archive_source = "https://launcher.mojang.com/v1/objects/a16d67e5807f57fc4e550299cf20226194497dc2/server.jar";
const java_server_archive_destination = path.join(__dirname, "server/java_server.jar");
const bedrock_server_archive_destination = path.join(__dirname, "server/bedrock_server.zip");

if(!fs.existsSync(minecraft_server_root_dir))
{
  fs.mkdirSync(minecraft_server_root_dir);
}

if(!fs.existsSync(bedrock_server_archive_destination))
{
  var download = fs.createWriteStream(bedrock_server_archive_destination);
  var request = https.get(bedrock_server_archive_source, function(response) {
    console.log("Downloading the Minecraft Bedrock Server App...");
    response.pipe(download);
    console.log("Success!");
  });
}

if(!fs.existsSync(java_server_archive_destination))
{
  var download = fs.createWriteStream(java_server_archive_destination);
  var request = https.get(java_server_archive_source, function(response) {
    console.log("Downloading the Minecraft Java Server App...");
    response.pipe(download);
    console.log("Success!");
  });
}

if(!fs.existsSync(minecraft_server_root_dir + bedrock_server_test_dir))
{
  fs.mkdirSync(minecraft_server_root_dir + bedrock_server_test_dir);
}
