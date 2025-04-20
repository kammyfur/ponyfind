const fs = require('fs');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = async (interaction) => {
    keys = interaction.values[0].split("|")
    console.log(interaction.user.tag + " (" + interaction.user.id + ") selected menu item " + keys[0]);
    if (statsMenu[keys[0]] !== undefined) {
        statsMenu[keys[0]]++;
    } else {
        statsMenu[keys[0]] = 1;
    }
    fs.writeFile("./stats/menu.json", JSON.stringify(statsMenu), () => {});

    if (keys[0].startsWith("report.issue.")) {
        item = keys[0].substr(13)
        tid = "./reports/Telemetry-Pony-" + (new Date().toISOString().replace(/[^a-zA-Z0-9]/gm, "-")) + ".txt";
        fs.writeFileSync(tid, "-------------------------\nPonyfind Telemetry Report\n-------------------------\n\nReport Type:\n     Pony Issue Report\n\n-------------------------\n\nReporter:\n     " + interaction.user.tag + " (" + interaction.user.id + ")\n\nServer:\n     " + (interaction.guild ? interaction.guild.name : "[Direct Messages]") + " (" + (interaction.guild ? interaction.guild.id : 0) + ")\n\nChannel:\n     " + (interaction.channel ? interaction.channel.name : "[Direct Messages]") + " (" + (interaction.channel ? interaction.channel.id : 0) + ")\n\nItem:\n     " + keys[1] + "\n\nReport Type:\n     " + item)
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#28dc46')
                    .setTitle(l("Thanks for reporting an issue with", "Merci d'avoir signalé un problème avec", interaction.user.id, interaction.guild ? interaction.guild.id : 0) + " \"" + keys[1] + "\"" + l("!", " !", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    .setDescription(l("Your report has been sent to the developers. They can contact you later if your settings allow this to ask you more about your issue.\nThanks for your help!", "Votre rapport a bien été envoyé aux développeurs. Ils pourront vous recontacter si vos paramètres le permettent afin de vous poser plus de questions sur le problème que vous rencontrez.\nMerci d'aider à améliorer notre système !", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    .setFooter({ text: "Ticket ID: " + tid })
            ]
        });
    } else {
        throw new Error("Unknown Menu ID");
    }
}