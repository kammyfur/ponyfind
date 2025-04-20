const fs = require('fs');
const path = require('path');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed, MessageAttachment } = require('discord.js');

const getPixel = require('../modules/pixel.js');
const getEmbed = require("../modules/embed");
const getPublic = require("../modules/public");

module.exports = async (interaction) => {
    keys = interaction.customId.split("|")
    console.log(interaction.user.tag + " (" + interaction.user.id + ") pressed button " + keys[0]);
    if (statsButtons[keys[0]] !== undefined) {
        statsButtons[keys[0]]++;
    } else {
        statsButtons[keys[0]] = 1;
    }
    fs.writeFile("./stats/buttons.json", JSON.stringify(statsButtons), () => {});

    if (keys[0] === "pony.display") {
        let row;
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
    } else if (keys[0] === "pony.public") {
        if (typeof cooldowns[interaction.user.id] !== "undefined" && new Date() - cooldowns[interaction.user.id] < 30000) {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#dc2828')
                        .setTitle(l("Calm down!", "Calmez-vous !", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                        .setDescription(l("Please wait " + Math.ceil((30000 - (new Date() - cooldowns[interaction.user.id]))/1000) + " seconds before you can use this again.", "Patientez encore " + Math.ceil((30000 - (new Date() - cooldowns[interaction.user.id]))/1000) + " secondes avant de pouvoir réutiliser ça.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                ]
            });
        } else {
            try {
                await interaction.channel.send({
                    ephemeral: false,
                    embeds: [
                        getEmbed(keys[1], interaction.user.id, interaction.guild ? interaction.guild.id : 0, true, interaction.user, interaction.member, interaction.guild)
                    ],
                    components: [
                        new MessageActionRow()
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
                    ]
                });
                await interaction.reply({
                    ephemeral: interaction.guild !== null,
                    embeds: [
                        new MessageEmbed()
                            .setColor('#28dc46')
                            .setTitle(l("Show to everypony", "Afficher à tous", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setDescription(l("This pony has been sent publicly to this channel.", "Ce poney a été envoyé publiquement dans ce salon.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    ]
                });
                cooldowns[interaction.user.id] = new Date();
            } catch (e) {
                await interaction.reply({
                    ephemeral: interaction.guild !== null,
                    embeds: [
                        new MessageEmbed()
                            .setColor('#dc2828')
                            .setTitle(l("Show to everypony", "Afficher à tous", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setDescription(l("We are unable to send a message to this channel, make sure the bot have sufficient permissions.", "Nous ne parvenons pas à envoyer un message dans ce salon, assurez-vous que le robot dispose de sufficient de permissions.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    ]
                });
            }
        }
    } else if (keys[0] === "result.report") {
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#dc2828')
                    .setTitle(l("Report an issue with", "Signaler un problème avec", interaction.user.id, interaction.guild ? interaction.guild.id : 0) + " \"" + keys[1] + "\"")
                    .setDescription(l("If you think the result to your query is problematic, you can report it so that the developers fix the issue.", "Si vous pensez que le résultat donné est problématique, vous pouvez le signaler pour que les développeurs corrigent le problème.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('select')
                            .setPlaceholder(l("Select a type of issue", "Sélectionnez le type de problème", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .addOptions([
                                {
                                    label: l("Inappropriate", "Inapproprié", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    description: l("The result contains inappropriate content: chocking or violent.", "La réponse contient du contenu inapproprié à certains publics, choquant, ou violent.", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    value: 'report.issue.innapropriate|' + keys[1],
                                },
                                {
                                    label: l("Off topic", "Hors sujet", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    description: l("The result contains info that is unrelated to the aforementioned character.", "La réponse contient du contenu n'ayant pas de rapport avec le personnage évoqué.", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    value: 'report.issue.off|' + keys[1],
                                },
                                {
                                    label: l("Incoherent data", "Données incohérentes", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    description: l("The result contains incoherent data, due to a database error.", "La réponse contient des données incohérentes, dûes à une erreur dans la base de données.", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    value: 'report.issue.data|' + keys[1],
                                },
                                {
                                    label: l("Wrong result", "Mauvais résultat", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    description: l("The given result is not what was expected with this query.", "La réponse donnée n'est pas la réponse attendue par rapport à la demande.", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    value: 'report.issue.wrong|' + keys[1],
                                },
                                {
                                    label: l("Wrong image(s)", "Mauvaise(s) image(s)", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    description: l("One or more of the provided image(s) do(es)n't correspond to the shown character.", "Une ou plusieurs image(s) fournie(s) avec la réponse ne correspond(ent) pas au personnage affiché.", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    value: 'report.issue.image|' + keys[1],
                                },
                                {
                                    label: l("Wrong information", "Information erronée", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    description: l("A provided info does not correspond to the real info from a reliable source.", "Une information fournie ne correspond pas à la réelle information depuis une source fiable.", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    value: 'report.issue.missinfo|' + keys[1],
                                },
                                {
                                    label: l("Translation issue", "Problème de traduction", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    description: l("The English translation of a formerly French content is wrong and needs to be fixed.", "La version française d'un contenu originellement en anglais est erronée et doit être corrigée.", interaction.user.id, interaction.guild ? interaction.guild.id : 0),
                                    value: 'report.issue.translation|' + keys[1],
                                },
                            ]),
                    )
            ]
        });
    } else if (keys[0] === "pony.pixel") {
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#28dc46')
                    .setTitle(l("Pixel Art for", "Pixel Art correspondant à", interaction.user.id, interaction.guild ? interaction.guild.id : 0) + " \"" + keys[1] + "\"")
            ],
            files: [
                new MessageAttachment(fs.readFileSync(getPixel(keys[1])), path.basename(getPixel(keys[1])))
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("result.report|" + getPixel(keys[1]))
                            .setLabel(l("Report an issue", "Signaler un problème", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                            .setStyle("DANGER")
                    )
            ]
        });
    } else if (keys[0] === "result.suggest") {
        tid = "./reports/Telemetry-Request-" + (new Date().toISOString().replace(/[^a-zA-Z0-9]/gm, "-")) + ".txt";
        fs.writeFileSync(tid, "-------------------------\nPonyfind Telemetry Report\n-------------------------\n\nReport Type:\n     Pony Request Report\n\n-------------------------\n\nReporter:\n     " + interaction.user.tag + " (" + interaction.user.id + ")\n\nServer:\n     " + (interaction.guild ? interaction.guild.name : "[Direct Messages]") + " (" + (interaction.guild ? interaction.guild.id : 0) + ")\n\nChannel:\n     " + (interaction.channel ? interaction.channel.name : "[Direct Messages]") + " (" + (interaction.channel ? interaction.channel.id : 0) + ")\n\nItem:\n     " + keys[1] + "\n\nReport Type:\n     -");
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#28dc46')
                    .setTitle(l("Thanks for suggesting", "Merci d'avoir proposé", interaction.user.id, interaction.guild ? interaction.guild.id : 0) + " \"" + keys[1] + "\"" + l("!", " !", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    .setDescription(l("Your suggestion has been sent to the developers. They can contact you later if your settings allow this to ask you more about your request.\nThanks for your help!", "Votre suggestion a bien été envoyée aux développeurs. Ils pourront vous recontacter si vos paramètres le permettent afin de vous poser plus de questions sur votre requête.\nMerci d'aider à améliorer notre système !", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    .setFooter({ text: "Ticket ID: " + tid })
            ]
        });
    } else {
        throw new Error("Unknown Button ID");
    }
}