// Stable: https://discord.com/oauth2/authorize?client_id=928695013083316295&scope=bot%20applications.commands&permissions=0
// Beta:   https://discord.com/oauth2/authorize?client_id=929057534491361341&scope=bot%20applications.commands&permissions=0

console.log("Channel: " + (require('fs').existsSync("./beta") ? "beta" : "stable"));
global.channel = (require('fs').existsSync("./beta") ? "beta" : "stable");

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

if (!fs.existsSync("./user/userdata.json")) fs.writeFileSync("./user/userdata.json", "{}");
if (!fs.existsSync("./user/spoilers.json")) fs.writeFileSync("./user/spoilers.json", "{}");
if (!fs.existsSync("./user/servers.json")) fs.writeFileSync("./user/servers.json", "{}");
if (!fs.existsSync("./reports")) fs.mkdirSync("./reports");
if (!fs.existsSync("./stats")) fs.mkdirSync("./stats");
if (!fs.existsSync("./stats/commands.json")) fs.writeFileSync("./stats/commands.json", "{}");
if (!fs.existsSync("./stats/ponies.json")) fs.writeFileSync("./stats/ponies.json", "{}");
if (!fs.existsSync("./stats/buttons.json")) fs.writeFileSync("./stats/buttons.json", "{}");
if (!fs.existsSync("./stats/menu.json")) fs.writeFileSync("./stats/menu.json", "{}");
if (!fs.existsSync("./stats/queries.json")) fs.writeFileSync("./stats/queries.json", "{}");

const rest = new REST({ version: '9' }).setToken(fs.readFileSync("./config/token." + (require('fs').existsSync("./beta") ? "beta" : "stable") + ".txt").toString());
const { Client, Intents, MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
global.client = new Client({
    partials: ['MESSAGE', 'CHANNEL'],
    intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS']
});

const commandHandler = require('./handler/command');
const buttonHandler = require('./handler/button');
const menuHandler = require('./handler/menu');
const errorHandler = require('./handler/errors');

global.langs = JSON.parse(fs.readFileSync("./user/userdata.json").toString());
global.spoils = JSON.parse(fs.readFileSync("./user/spoilers.json").toString());
global.servers = JSON.parse(fs.readFileSync("./user/servers.json").toString());
global.statsCommands = JSON.parse(fs.readFileSync("./stats/commands.json").toString());
global.statsPonies = JSON.parse(fs.readFileSync("./stats/ponies.json").toString());
global.statsButtons = JSON.parse(fs.readFileSync("./stats/buttons.json").toString());
global.statsMenu = JSON.parse(fs.readFileSync("./stats/menu.json").toString());
global.statsQueries = JSON.parse(fs.readFileSync("./stats/queries.json").toString());
global.cooldowns = {};

global.l = (en, fr, id, gid) => {
    if (typeof servers[gid] !== "undefined") {
        if (servers[gid] === "fr") {
            return fr;
        } else {
            return en;
        }
    } else {
        if (langs[id] === "fr") {
            return fr;
        } else {
            return en;
        }
    }
}

const admin = fs.readFileSync("./config/admin.txt").toString().trim();
const commands = require('./modules/registers');
const getHelp = require("./modules/help");

client.on('ready', async () => {
    client.user.setActivity("/help", { type: "LISTENING" })
    console.log(`Logged in as ${client.user.tag}!`);
    console.log("Started refreshing application (/) commands globally");

    await rest.put(
        Routes.applicationCommands(fs.readFileSync("./config/client." + (require('fs').existsSync("./beta") ? "beta" : "stable") + ".txt").toString()),
        { body: commands },
    );

    console.log("Successfully reloaded application (/) commands globally");
});

client.on('messageCreate', message => {
    if (channel === "beta" && message.author.id === admin && message.content.startsWith("$pf>")) {
        console.log(message.author.tag + " (" + message.author.id + ") ran JavaScript code");
        try {
            let e = "undefined";
            let r = eval(message.content.substring(4).trim());
            if (r !== undefined) {
                e = r.toString();
            }
            message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#28dc46')
                        .setTitle("JavaScript")
                        .setDescription("```\n" + e.replace(/`/g, "\\`") + "\n```")
                ]
            });
        } catch (e) {
            message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#dc2828')
                        .setTitle("JavaScript")
                        .setDescription("```\n" + e.stack + "\n```")
                ]
            });
        }
    } else if (message.content.trim() === "<@" + client.user.id + ">" || message.content.trim() === "<@!" + client.user.id + ">") {
        message.reply(getHelp(message.guild, message.guild.id, message.author.id, true));
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction) { return; }

    try {
        if (interaction.isCommand()) {
            await commandHandler(interaction);
        } else if (interaction.isButton()) {
            await buttonHandler(interaction);
        } else if (interaction.isSelectMenu()) {
            await menuHandler(interaction);
        } else {
            throw new Error("Interaction type not supported")
        }
    } catch (e) {
        errorHandler(interaction, e)
    }
});

client.login(fs.readFileSync("./config/token." + (require('fs').existsSync("./beta") ? "beta" : "stable") + ".txt").toString());