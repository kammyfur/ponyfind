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
    if (interaction.options.getSubcommand() === 'serverlang') {
        if (interaction.guild === null) {
            await interaction.reply({
                ephemeral: false,
                embeds: [
                    new MessageEmbed()
                        .setColor('#dc2828')
                        .setTitle(l("Not a server", "Pas un serveur", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("You are trying to run a server-exclusive command in a direct message chat. Please run this command again on a server.", "Vous essayez d'exécuter une commande exclusive aux serveurs dans une conversation en messages privés. Veuillez réessayer cette commande sur un serveur.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
            return;
        }

        if (!interaction.guild.members.resolve(interaction.user).permissions.has("MANAGE_GUILD") && interaction.user.id !== admin) {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#dc2828')
                        .setTitle(l("Permission denied", "Accès refusé", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("You don't have sufficient permission to run this command. You need to be a bot administrator, or have the **Manage Server** permission.", "Vous ne disposez pas de permissions suffisantes pour exécuter cette commande. Vous devez être administrateur(ice) de robot, ou avoir la permission **Gérer le serveur**.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
            return;
        }

        lang = interaction.options.getString('locale');
        if (lang === "fr") {
            servers[interaction.guild ? interaction.guild.id : 0] = "fr";
        } else if (lang === "en") {
            servers[interaction.guild ? interaction.guild.id : 0] = "en";
        } else {
            delete servers[interaction.guild ? interaction.guild.id : 0];
        }
        fs.writeFileSync("./user/servers.json", JSON.stringify(servers, null, 4));
        if (lang === "en" || lang === "fr") {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#28dc46')
                        .setTitle(l("Server language settings", "Paramètres de langue du serveur", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("This server's enforced language is now **English**.", "La langue forcée sur ce serveur est maintenant le **français**.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
        } else {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#28dc46')
                        .setTitle(l("Server language settings", "Paramètres de langue du serveur", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("This server's enforced language is the user's prefered language.", "La langue forcée sur ce serveur est la langue de l'utilisateur.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
        }
    }

    if (interaction.options.getSubcommand() === 'lang') {
        lang = interaction.options.getString('locale');
        if (lang === "fr") {
            langs[interaction.user.id] = "fr";
        } else {
            langs[interaction.user.id] = "en";
        }
        fs.writeFileSync("./user/userdata.json", JSON.stringify(langs, null, 4));
        if (typeof servers[interaction.guild ? interaction.guild.id : 0] !== "undefined") {
            if (lang === "fr") {
                await interaction.reply({
                    ephemeral: interaction.guild !== null,
                    embeds: [
                        new MessageEmbed()
                            .setColor('#28dc46')
                            .setTitle(l("Language settings", "Paramètres de langue", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setDescription(l("Your preferred language is now **French**.\n\n> **Note:** This server enforces English for all users, your personal preferred language won't apply here.", "Votre langue principale est maintenant le **français**.\n\n> **Note :** Ce serveur oblige l'utilisation du français pour tous les utilisateurs, votre option de langue personelle ne s'appliquera pas ici.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    ]
                });
            } else {
                await interaction.reply({
                    ephemeral: interaction.guild !== null,
                    embeds: [
                        new MessageEmbed()
                            .setColor('#28dc46')
                            .setTitle(l("Language settings", "Paramètres de langue", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setDescription(l("Your preferred language is now **English**.\n\n> **Note:** This server enforces English for all users, your personal preferred language won't apply here.", "Votre langue principale est maintenant le **anglais**.\n\n> **Note :** Ce serveur oblige l'utilisation du français pour tous les utilisateurs, votre option de langue personelle ne s'appliquera pas ici.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    ]
                });
            }
        } else {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#28dc46')
                        .setTitle(l("Language settings", "Paramètres de langue", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("Your preferred language is now **English**.", "Votre langue principale est maintenant le **français**.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
        }
    }

    if (interaction.options.getSubcommand() === 'spoilers') {
        v = interaction.options.getString('status');
        if (v === "yes") {
            spoils[interaction.user.id] = 2;
        } else if (v === "no") {
            spoils[interaction.user.id] = 0;
        } else {
            spoils[interaction.user.id] = 1;
        }
        fs.writeFileSync("./user/spoilers.json", JSON.stringify(spoils, null, 4));
        if (v === "yes") {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#28dc46')
                        .setTitle(l("Spoilers settings", "Paramètres des révélations", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("Spoilers are now **always shown**.", "Les révélations sont désormais **toujours affichées**.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
        } else if (v === "no") {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#28dc46')
                        .setTitle(l("Spoilers settings", "Paramètres des révélations", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("Spoilers are now **always hidden**.", "Les révélations sont désormais **toujours masquées**.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
        } else {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#28dc46')
                        .setTitle(l("Spoilers settings", "Paramètres des révélations", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("Spoilers are now **hidden under spoiler tags**.", "Les révélations sont désormais **masqués derrière des tags révélation**.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
        }
    }
}