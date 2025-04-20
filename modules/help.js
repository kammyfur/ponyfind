const {MessageEmbed} = require("discord.js");
module.exports = (guild, gid, uid, inMessage) => {
    if (inMessage === undefined) {
        inMessage = false;
    }

    let fields = [
        { name: l("Search for a pony", "Rechercher un poney", uid, guild ? gid : 0), value: l("With the `/pony` command, you can search for any known pony from My Little Pony generations 4 and 5.", "Avec la commande `/pony`, vous pouvez chercher n'importe quel poney de My Little Pony générations 4 ou 5.", uid, guild ? gid : 0) },
        { name: l("Enable or disable spoilers", "Activer ou désactiver le révélations", uid, guild ? gid : 0), value: l("With `/config spoilers`, you can adjust whether or not you want to see spoilers.", "Avec `/config spoilers`, vous pouvez ajuster si vous voulez ou non voir des révélations.", uid, guild ? gid : 0) },
        { name: l("Get stats about the bot", "Obtenir des statistiques sur le robot", uid, guild ? gid : 0), value: l("`/info` helps you get stats and other useful information about the bot and its inner workings.", "`/info` vous permet d'obtenir des statistiques ainsi que d'autres informations utiles à propos du robot et de son fonctionnement.", uid, guild ? gid : 0) },
        { name: l("Having issues with custom emojis?", "Vous avez des problèmes avec les emojis personnalisés ?", uid, guild), value: l("Ponyfind relies on custom emojis in some commands. If they don't show properly, make sure both the bot and the \\@everyone have the permission to use external emojis.", "Ponyfind s'appuie sur des emojis personnalisés dans certaines commandes. Si ils ne s'affichent pas correctement, assurez-vous que le robot ainsi que le role \\@everyone disposent de la permission d'utiliser des emojis externes", uid, guild) },
        { name: l("Add some more magic!", "Ajouter encore plus de magie !", uid, guild ? gid : 0), value: l("Try `/random`, you will be surprised!.", "Essayez `/random`, vous serez surpris(e) !", uid, guild ? gid : 0) },
    ];

    let obj = {
        embeds: [
            new MessageEmbed()
                .setColor('#d6dc28')
                .setTitle(l("Ponyfind help", "Aide de Ponyfind", uid, guild ? gid : 0))
                .setDescription(inMessage ? l("Thanks for using Ponyfind! If you're confused or don't know where to start, you've executed the right command.", "Merci d'utiliser Ponyfind ! Si vous êtes confus(e) et/ou que vous ne savez pas par où commencer, vous êtes au bon endroit.", uid, guild ? gid : 0) + "\n\n> :information_source: " + l("**To prevent spamming this channel,** use `/help` next time", "**Pour éviter de polluer ce salon,** utilisez `/help` la prochaine fois", uid, guild ? gid : 0) : l("Thanks for using Ponyfind! If you're confused or don't know where to start, you've executed the right command.", "Merci d'utiliser Ponyfind ! Si vous êtes confus(e) et/ou que vous ne savez pas par où commencer, vous êtes au bon endroit.", uid, gid ? guild : 0) + "\n\n> :information_source: " + l("**Vous parlez français ?** Exécutez `/config lang Français` pour changer la langue", "**You speak English?** Run `/config lang English` to change the language", uid, guild ? gid : 0))
                .addFields(fields)
                .setFooter(l("made with ♥ by Minteck, a My Little Pony fan", "fait avec ♥ par Minteck, une fan de My Little Pony", uid, guild ? gid : 0))
        ]
    };

    if (!inMessage) {
        obj.ephemeral = guild !== null;
    }
    
    return obj;
}