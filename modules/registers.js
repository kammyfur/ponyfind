const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = [
    new SlashCommandBuilder()
        .setName('pony')
        .setDescription("Searches for a pony")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("The pony to search for")
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('info')
        .setDescription("Gets stats and info about the bot"),
    new SlashCommandBuilder()
        .setName('help')
        .setDescription("Gets help about how to use the bot"),
    new SlashCommandBuilder()
        .setName('random')
        .setDescription("Picks a random pony"),
    // new SlashCommandBuilder()
    //     .setName('lang')
    //     .setDescription("Changes the bot's language")
    //     .addStringOption(option =>
    //         option.setName('locale')
    //             .setDescription('The selected language')
    //             .setRequired(true)
    //             .addChoice('Français', 'fr')
    //             .addChoice('English', 'en')
    //     ),
    new SlashCommandBuilder()
        .setName('config')
        .setDescription("Configure all aspects of the bot")
        .addSubcommand(subcommand =>
            subcommand.setName('lang')
                .setDescription("Changes the bot's language")
                .addStringOption(option =>
                    option.setName('locale')
                        .setDescription('The selected language')
                        .setRequired(true)
                        .addChoice('Français', 'fr')
                        .addChoice('English', 'en')
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('spoilers')
                .setDescription("Enable, disable or hide spoilers in replies")
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('Value')
                        .setRequired(true)
                        .addChoice('Always show spoilers', 'yes')
                        .addChoice('Show under spoiler tags (default)', 'hide')
                        .addChoice('Never show spoilers', 'no')
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('serverlang')
                .setDescription("Changes the bot's language on this server")
                .addStringOption(option =>
                    option.setName('locale')
                        .setDescription('The selected language')
                        .setRequired(true)
                        .addChoice('Français', 'fr')
                        .addChoice('English', 'en')
                        .addChoice('User prefered language (default)', 'off')
                )
        ),
    // new SlashCommandBuilder()
    //     .setName('serverlang')
    //     .setDescription("Changes the bot's language on this server")
    //     .addStringOption(option =>
    //         option.setName('locale')
    //             .setDescription('The selected language')
    //             .setRequired(true)
    //             .addChoice('Français', 'fr')
    //             .addChoice('English', 'en')
    //             .addChoice('User prefered language (default)', 'off')
    //     )
]