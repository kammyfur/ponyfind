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
    keys = [
        null,
        list[Math.floor(Math.random() * list.length)]
    ]
    if (statsPonies[keys[1]] !== undefined) {
        statsPonies[keys[1]]++;
    } else {
        statsPonies[keys[1]] = 1;
    }
    fs.writeFile("./stats/ponies.json", JSON.stringify(statsPonies), () => {});
    await interaction.reply({
        ephemeral: interaction.guild !== null,
        embeds: [
            getEmbed(keys[1], interaction.user.id, interaction.guild ? interaction.guild.id : 0, false, interaction.user, interaction.member, interaction.guild)
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
}