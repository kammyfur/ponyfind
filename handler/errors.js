const fs = require('fs');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = async (interaction, e) => {
    console.error(e);
    tid = "./reports/Telemetry-Crash-" + (new Date().toISOString().replace(/[^a-zA-Z0-9]/gm, "-")) + ".txt";
    fs.writeFileSync(tid, "-------------------------\nPonyfind Telemetry Report\n-------------------------\n\nReport Type:\n     System Crash Report\n\n-------------------------\n\nReporter:\n     " + interaction.user.tag + " (" + interaction.user.id + ")\n\nServer:\n     " + (interaction.guild ? interaction.guild.name : "[Direct Messages]") + " (" + (interaction.guild ? interaction.guild.id : 0) + ")\n\nChannel:\n     " + (interaction.channel ? interaction.channel.name : "[Direct Messages]") + " (" + (interaction.channel ? interaction.channel.id : 0) + ")\n\nItem:\n     -\n\nReport Type:\n     Automated Error Report\n\n-------------------------\n\n" + e.stack)
    try {
        await interaction.reply({
            ephemeral: interaction.guild !== null,
            embeds: [
                new MessageEmbed()
                    .setColor('#dc2828')
                    .setTitle(l("An internal exception occurred", "Une erreur interne s'est produite", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    .setDescription(l("That's not your fault! The developers have already been informed about the issue and will resolve it as soon as possible.", "Ce n'est pas votre faute ! Les développeurs ont déjà été informés du problème et il sera corrigé aussi vite que possible.", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
                    .setFooter({ text: "Ticket ID: " + tid })
            ]
        });
    } catch (e2) {
        tid = "./reports/Telemetry-Crash-" + (new Date().toISOString().replace(/[^a-zA-Z0-9]/gm, "-")) + ".txt";
        fs.writeFileSync(tid, "-------------------------\nPonyfind Telemetry Report\n-------------------------\n\nReport Type:\n     System Crash Report\n\n-------------------------\n\nReporter:\n     " + interaction.user.tag + " (" + interaction.user.id + ")\n\nServer:\n     " + (interaction.guild ? interaction.guild.name : "[Direct Messages]") + " (" + (interaction.guild ? interaction.guild.id : 0) + ")\n\nChannel:\n     " + (interaction.channel ? interaction.channel.name : "[Direct Messages]") + " (" + (interaction.channel ? interaction.channel.id : 0) + ")\n\nItem:\n     -\n\nReport Type:\n     Automated Error Report (chained with " + e.message + ")\n\n-------------------------\n\n" + e2.stack)
        try {
            await interaction.reply({
                ephemeral: interaction.guild !== null,
                embeds: [
                    new MessageEmbed()
                        .setColor('#dc2828')
                        .setTitle("2 internal exceptions occurred")
                        .setDescription("That's not your fault! The developers have already been informed about the issue and will resolve it as soon as possible. We additionally weren't able to deliver you a localized error message.")
                        .setFooter({ text: "Ticket ID: " + tid })
                ]
            });
        } catch (e3) {
            tid = "./reports/Telemetry-Crash-" + (new Date().toISOString().replace(/[^a-zA-Z0-9]/gm, "-")) + ".txt";
            fs.writeFileSync(tid, "-------------------------\nPonyfind Telemetry Report\n-------------------------\n\nReport Type:\n     System Crash Report\n\n-------------------------\n\nReporter:\n     " + interaction.user.tag + " (" + interaction.user.id + ")\n\nServer:\n     " + (interaction.guild ? interaction.guild.name : "[Direct Messages]") + " (" + (interaction.guild ? interaction.guild.id : 0) + ")\n\nChannel:\n     " + (interaction.channel ? interaction.channel.name : "[Direct Messages]") + " (" + (interaction.channel ? interaction.channel.id : 0) + ")\n\nItem:\n     -\n\nReport Type:\n     Automated Error Report (chained with " + e.message + " and " + e2.message + ")\n\n-------------------------\n\n" + e3.stack)
            try {
                interaction.channel.send({embeds: [new MessageEmbed()
                        .setColor('#dc2828')
                        .setTitle("3 internal exceptions occurred")
                        .setDescription("That's not your fault! The developers have already been informed about the issue and will resolve it as soon as possible. We additionally weren't able to deliver you a localized error message and/or through a reply to your command.")]
                        .setFooter({ text: "Ticket ID: " + tid })
                }).catch((e4) => {
                    tid = "./reports/Telemetry-Crash-" + (new Date().toISOString().replace(/[^a-zA-Z0-9]/gm, "-")) + ".txt";
                    fs.writeFileSync(tid, "-------------------------\nPonyfind Telemetry Report\n-------------------------\n\nReport Type:\n     System Crash Report\n\n-------------------------\n\nReporter:\n     " + interaction.user.tag + " (" + interaction.user.id + ")\n\nServer:\n     " + (interaction.guild ? interaction.guild.name : "[Direct Messages]") + " (" + (interaction.guild ? interaction.guild.id : 0) + ")\n\nChannel:\n     " + (interaction.channel ? interaction.channel.name : "[Direct Messages]") + " (" + (interaction.channel ? interaction.channel.id : 0) + ")\n\nItem:\n     -\n\nReport Type:\n     Automated Error Report (chained with " + e.message + ", " + e2.message + " and " + e3.message + ")\n\n-------------------------\n\n" + e4.stack)
                    interaction.user.send({
                        embeds: [new MessageEmbed()
                            .setColor('#dc2828')
                            .setTitle("4 internal exceptions occurred")
                            .setDescription("That's not your fault! The developers have already been informed about the issue and will resolve it as soon as possible. We additionally weren't able to deliver you a localized error message, through a reply to your command and/or through the channel you initially executed the command.")]
                            .setFooter({ text: "Ticket ID: " + tid })
                    })
                })
            } catch (e) {}
        }
    }
}