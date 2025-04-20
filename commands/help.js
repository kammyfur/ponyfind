const fs = require('fs');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');

const admin = fs.readFileSync("./config/admin.txt").toString().trim();
const list = Object.keys(JSON.parse(fs.readFileSync("./data/data.json").toString()));

const getResult = require('../modules/result');
const getEmbed = require('../modules/embed');
const getPixel = require("../modules/pixel");
const getHelp = require("../modules/help");

const official = fs.readFileSync("./config/official.txt").toString().replace(/\r\n/g, "\n").split("\n");
const fpserver = fs.readFileSync("./config/fpserver.txt").toString().trim();

module.exports = async (interaction) => {
    await interaction.reply(getHelp(interaction.guild, interaction.guild.id, interaction.user.id, false));
}