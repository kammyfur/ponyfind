const fs = require('fs');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');

const admin = fs.readFileSync("./config/admin.txt").toString().trim();
const list = Object.keys(JSON.parse(fs.readFileSync("./data/data.json").toString()));

const getResult = require('../modules/result');
const getEmbed = require('../modules/embed');
const getPixel = require("../modules/pixel");

const official = fs.readFileSync("./config/official.txt").toString().replace(/\r\n/g, "\n").split("\n");
const fpserver = fs.readFileSync("./config/fpserver.txt").toString().trim();

const commandRandom = require('../commands/random');
const commandInfo = require('../commands/info');
const commandEval = require('../commands/eval');
const commandConfig = require('../commands/config');
const commandPony = require('../commands/pony');
const commandHelp = require('../commands/help');

module.exports = async (interaction) => {
    console.log(interaction.user.tag + " (" + interaction.user.id + ") used command /" + interaction.commandName);
    if (statsCommands[interaction.commandName] !== undefined) {
        statsCommands[interaction.commandName]++;
    } else {
        statsCommands[interaction.commandName] = 1;
    }
    fs.writeFile("./stats/commands.json", JSON.stringify(statsCommands), () => {});

    if (interaction.commandName === 'random') {
        await commandRandom(interaction);
    }

    if (interaction.commandName === 'help') {
        await commandHelp(interaction);
    }

    if (interaction.commandName === 'info') {
        await commandInfo(interaction);
    }

    if (interaction.commandName === 'eval') {
        await commandEval(interaction);
    }

    if (interaction.commandName === 'config') {
        await commandConfig(interaction);
    }

    if (interaction.commandName === 'pony') {
        await commandPony(interaction);
    }
}