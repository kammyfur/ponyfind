const fs = require('fs');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');

const admin = fs.readFileSync("./config/admin.txt").toString().trim();
const list = Object.keys(JSON.parse(fs.readFileSync("./data/data.json").toString()));

const getResult = require('../modules/result');
const getEmbed = require('../modules/embed');
const getPixel = require("../modules/pixel");

const official = fs.readFileSync("./config/official.txt").toString().replace(/\r\n/g, "\n").split("\n");
const fpserver = fs.readFileSync("./config/fpserver.txt").toString().trim();

function bytesToPretty(bytes, uid, gid) {
    if (bytes > 1000) {
        if (bytes > 1000000) {
            return (bytes / 1000000).toFixed(2) + " " + l("MB", "Mo", uid, gid);
        } else {
            return (bytes / 1000).toFixed(2) + " " + l("KB", "Ko", uid, gid);
        }
    } else {
        return bytes + " " + l("B", "o", uid, gid);
    }
}

function secondsToPretty(seconds, uid, gid) {
    if (seconds > 60) {
        if (seconds > 3600) {
            if (seconds > 86400) {
                return Math.floor(seconds / 86400) + " " + l("day", "jour", uid, gid) + (Math.floor(seconds / 86400) > 1 ? "s" : "");
            } else {
                return Math.floor(seconds / 3600) + " " + l("hour", "heure", uid, gid) + (Math.floor(seconds / 3600) > 1 ? "s" : "");
            }
        } else {
            return Math.floor(seconds / 60) + " minute" + (Math.floor(seconds / 60) > 1 ? "s" : "");
        }
    } else {
        return Math.floor(seconds) + " " + l("second", "seconde", uid, gid) + (Math.floor(seconds) > 1 ? "s" : "");
    }
}

module.exports = async (interaction) => {
    let suffix = "";
    if (official.includes(interaction.guild ? interaction.guild.id : 0)) {
        suffix = ".official-" + (interaction.guild ? interaction.guild.id : 0);
    } else {
        if ((interaction.guild ? interaction.guild.id : 0) === fpserver) {
            suffix = ".francoponies-exp" + fs.readFileSync("./config/fpexperience.txt").toString();
        }
    }

    let size = 0;
    for (let file of fs.readdirSync("./data")) size += fs.readFileSync("./data/" + file).length;
    let sizep = bytesToPretty(size);

    let statsCommand = "-";
    let statsCommandUsage = "n/a";

    let statsCommandsP = statsCommands
    try { delete statsCommandsP["eval"]; } catch (e) {}

    try {
        statsCommand = Object.keys(statsCommandsP).reduce((a, b) => statsCommandsP[a] > statsCommandsP[b] ? a : b);
        statsCommandUsage = statsCommandsP[Object.keys(statsCommandsP).reduce((a, b) => statsCommandsP[a] > statsCommandsP[b] ? a : b)].toString();
    } catch (e) {
        console.error(e);
    }

    let statsPony = "-";
    let statsPonyUsage = "n/a";
    try {
        statsPony = Object.keys(statsPonies).reduce((a, b) => statsPonies[a] > statsPonies[b] ? a : b);
        statsPonyUsage = statsPonies[Object.keys(statsPonies).reduce((a, b) => statsPonies[a] > statsPonies[b] ? a : b)].toString();
    } catch (e) {
        console.error(e);
    }

    let fields = [
        { name: l("Software version", "Version du logiciel", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: "v" + fs.readFileSync("./config/version.txt").toString().trim() + "." + fs.readFileSync("./.git/refs/heads/trunk").toString().substr(0, 8) + suffix + " (#" + client.shard.count + ")", inline: false },
        { name: l("Kernel version", "Version du noyau", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: process.version, inline: true },
        { name: l("Experience channel", "Canal d'expériences", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: channel, inline: true },
        { name: l("Known ponies", "Poneys connus", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: Object.keys(JSON.parse(fs.readFileSync("./data/data.json").toString())).length.toString(), inline: true },
        { name: l("Most used command", "Commande la plus utilisée", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: "`/" + statsCommand + "`\n(" + l("used " + statsCommandUsage + " times", "utilisée " + statsCommandUsage + " fois", interaction.user.id, interaction.guild ? interaction.guild.id : 0) + ")", inline: true },
        { name: l("Most viewed pony", "Poney le plus consulté", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: statsPony + "\n(" + l("viewed " + statsPonyUsage + " times", "consulté " + statsPonyUsage + " fois", interaction.user.id, interaction.guild ? interaction.guild.id : 0) + ")", inline: true },
        { name: l("Awaiting issue reports", "Rapports de problèmes en attente", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: fs.readdirSync("./reports").length.toString(), inline: true },
        { name: l("Database size", "Taille de la base de données", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: sizep, inline: true },
        { name: l("Memory usage", "Utilisation de la mémoire", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: bytesToPretty(process.memoryUsage().rss + process.memoryUsage().heapTotal + process.memoryUsage().external + process.memoryUsage().arrayBuffers, interaction.user.id, interaction.guild ? interaction.guild.id : 0), inline: true },
        { name: l("Uptime", "Durée de fonctionnement", interaction.user.id, interaction.guild ? interaction.guild.id : 0), value: secondsToPretty(process.uptime(), interaction.user.id, interaction.guild ? interaction.guild.id : 0), inline: true },
    ];

    await interaction.reply({
        ephemeral: interaction.guild !== null,
        embeds: [
            new MessageEmbed()
                .setColor('#d6dc28')
                .setTitle(l("Bot stats", "Statistiques du robot", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                .setDescription(l("Ponyfind is a Discord bot that helps you get easy and fast access to data relative to My Little Pony (generations 4 and 5).", "Ponyfind est un robot Discord qui vous aide à obtenir un accès simple et rapide à des données relatives à My Little Pony (générations 4 et 5).", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                .addFields(fields)
                .setFooter({ text: l("made with ♥ by Minteck, a My Little Pony fan", "fait avec ♥ par Minteck, une fan de My Little Pony", interaction.user.id, interaction.guild ? interaction.guild.id : 0) })
        ]
    });
}
