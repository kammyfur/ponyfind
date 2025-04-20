const fs = require('fs');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');

const admin = fs.readFileSync("./config/admin.txt").toString().trim();
const list = Object.keys(JSON.parse(fs.readFileSync("./data/data.json").toString()));

const getResult = require('../modules/result');
const getEmbed = require('../modules/embed');
const getPixel = require("../modules/pixel");

const official = fs.readFileSync("./config/official.txt").toString().replace(/\r\n/g, "\n").split("\n");
const fpserver = fs.readFileSync("./config/fpserver.txt").toString().trim();

module.exports = async (interaction) => {
    if (interaction.user.id !== admin) {
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#dc2828')
                    .setTitle(l("Permission denied", "Accès refusé", interaction.user.id, 0))
                    .setDescription(l("You don't have sufficient permission to run this command. You need to be a bot administrator, or have the **Manage Server** permission.", "Vous ne disposez pas de permissions suffisantes pour exécuter cette commande. Vous devez être administrateur(ice) de robot, ou avoir la permission **Gérer le serveur**.", interaction.user.id, 0))
            ]
        });
        return;
    }

    try {
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#28dc46')
                    .setTitle("JavaScript")
                    .setDescription("```\n" + await eval(interaction.options.getString("code")).toString().replace(/`/g, "\\`") + "\n```")
            ]
        });
    } catch (e) {
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#dc2828')
                    .setTitle("JavaScript")
                    .setDescription("```\n" + e.stack + "\n```")
            ]
        });
    }
}