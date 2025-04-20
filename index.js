global.channel = (require('fs').existsSync("./beta") ? "beta" : "stable");
const { ShardingManager } = require('discord.js');
const fs = require("fs");

const manager = new ShardingManager('./bot.js', { token: fs.readFileSync("./config/token." + (require('fs').existsSync("./beta") ? "beta" : "stable") + ".txt").toString() });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();