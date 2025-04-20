const { MessageButton } = require("discord.js");

module.exports = (interaction, keys) => {
    if (typeof cooldowns[interaction.user.id] !== "undefined" && new Date() - cooldowns[interaction.user.id] < 30000) {
        return new MessageButton()
            .setCustomId("pony.public|" + keys[1])
            .setLabel(l("Wait " + Math.ceil((30000 - (new Date() - cooldowns[interaction.user.id]))/1000) + " seconds", "Patientez " + Math.ceil((30000 - (new Date() - cooldowns[interaction.user.id]))/1000) + " secondes", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
            .setStyle("PRIMARY")
            .setDisabled(true);
    } else {
        return new MessageButton()
            .setCustomId("pony.public|" + keys[1])
            .setLabel(l("Show to everypony", "Afficher à tous", interaction.user.id, interaction.guild ? interaction.guild.id : 0))
            .setStyle("PRIMARY")
    }
}