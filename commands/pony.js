const fs = require('fs');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');

const admin = fs.readFileSync("./config/admin.txt").toString().trim();
const list = Object.keys(JSON.parse(fs.readFileSync("./data/data.json").toString()));

const getResult = require('../modules/result');
const getEmbed = require('../modules/embed');
const getPixel = require("../modules/pixel");
const getPublic = require('../modules/public');

const official = fs.readFileSync("./config/official.txt").toString().replace(/\r\n/g, "\n").split("\n");
const fpserver = fs.readFileSync("./config/fpserver.txt").toString().trim();

module.exports = async (interaction) => {
    query = interaction.options.getString('query').toLowerCase();
    result = getResult(query);

    if (result.results.length > 0 && getEmbed(result.results[0], interaction.user.id, interaction.guild ? interaction.guild.id : 0) !== false) {
        if (statsQueries[result.results[0]] !== undefined) {
            if (!statsQueries[result.results[0]].includes(query)) {
                statsQueries[result.results[0]].push(query);
            }
        } else {
            statsQueries[result.results[0]] = [ query ];
        }
        fs.writeFile("./stats/queries.json", JSON.stringify(statsQueries), () => {});
        if (result.results[0].toLowerCase().trim() === query.toLowerCase().trim()) {
            keys = [null, result.results[0]];
            if (statsPonies[keys[1]] !== undefined) {
                statsPonies[keys[1]]++;
            } else {
                statsPonies[keys[1]] = 1;
            }
            fs.writeFile("./stats/ponies.json", JSON.stringify(statsPonies), () => {});
            if (interaction.guild) {
                row = new MessageActionRow()
                    .addComponents(
                        getPublic(interaction, keys),
                        new MessageButton()
                            .setLabel(l("Read More", "Lire plus", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setStyle("LINK")
                            .setURL("https://mlp.fandom.com/wiki/" + encodeURI(keys[1])),
                        new MessageButton()
                            .setCustomId("pony.pixel|" + keys[1])
                            .setLabel("Pixel Art")
                            .setDisabled(!fs.existsSync("./pixel/" + keys[1].toLowerCase()))
                            .setStyle("SECONDARY"),
                        new MessageButton()
                            .setCustomId("result.report|" + keys[1])
                            .setLabel(l("Report an issue", "Signaler un problème", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setStyle("DANGER")
                    )
            } else {
                row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel(l("Read More", "Lire plus", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setStyle("LINK")
                            .setURL("https://mlp.fandom.com/wiki/" + encodeURI(keys[1])),
                        new MessageButton()
                            .setCustomId("pony.pixel|" + keys[1])
                            .setLabel("Pixel Art")
                            .setDisabled(!fs.existsSync("./pixel/" + keys[1].toLowerCase()))
                            .setStyle("SECONDARY"),
                        new MessageButton()
                            .setCustomId("result.report|" + keys[1])
                            .setLabel(l("Report an issue", "Signaler un problème", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setStyle("DANGER")
                    )
            }
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    getEmbed(keys[1], interaction.user.id, interaction.guild ? interaction.guild.id : 0, false, interaction.user, interaction.member, interaction.guild)
                ],
                components: [
                    row
                ]
            });
        } else {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#d6dc28')
                        .setTitle(l("Results for", "Résultats pour", interaction.user.id, interaction.guild ? interaction.guild.id : 0) + " \"" + query + "\"")
                        .setDescription(l("Here are the 3 first results corresponding to your query.", "Voici les 3 premiers résultats correspondants à votre recherche.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId("pony.display|" + result.first[0])
                                .setLabel(result.first[0])
                                .setStyle("PRIMARY"),
                            new MessageButton()
                                .setCustomId("pony.display|" + result.first[1])
                                .setLabel(result.first[1])
                                .setStyle("PRIMARY"),
                            new MessageButton()
                                .setCustomId("pony.display|" + result.first[2])
                                .setLabel(result.first[2])
                                .setStyle("PRIMARY"),
                            new MessageButton()
                                .setCustomId("result.report|" + query)
                                .setLabel(l("Report an issue", "Signaler un problème", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                                .setStyle("DANGER")
                        )
                ]
            });
        }
    } else {
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#dc2828')
                    .setTitle(l("Results for", "Résultats pour", interaction.user.id, interaction.guild ? interaction.guild.id : 0) + " \"" + query + "\"")
                    .setDescription(l("No results found. Please try with other keywords.", "Aucun résultat trouvé. Essayez avec d'autres mots clés.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("result.suggest|" + query)
                            .setLabel(l("Suggest a missing pony", "Proposer un poney manquant", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setStyle("SECONDARY"),
                        new MessageButton()
                            .setCustomId("result.report|" + query)
                            .setLabel(l("Report an issue", "Signaler un problème", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setStyle("DANGER")
                    )
            ]
        });
    }
}