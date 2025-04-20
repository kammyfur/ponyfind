module.exports = (emoji, member, guild) => {
    if (guild) {
        let me = guild.me;

        if (guild.roles.everyone.permissions.has("USE_EXTERNAL_EMOJIS") && me.permissions.has("USE_EXTERNAL_EMOJIS")) {
            return emoji;
        } else {
            return "";
        }
    } else {
        return emoji;
    }
}