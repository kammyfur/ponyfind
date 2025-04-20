const fs = require('fs');
const db = JSON.parse(fs.readFileSync("./data/data.json").toString());

const icons = require('./icons.js');
const customEmoji = require("./emoji");
const getKindIcon = require("./kind");

module.exports = (pony, uid, gid, member, guild) => {
    sel = db[pony];
    switch (d.generation) {
        case 4:
            return customEmoji(icons.generations.g4, member, guild) + " " + l("Friendship is Magic", "Les amies c'est magique", uid, gid);

        case 5:
            return customEmoji(icons.generations.g5, member, guild) + " " + l("A New Generation", "Nouvelle Génération", uid, gid);

        default:
            return customEmoji(icons.generations.other, member, guild) + " " + l("Other/Unknown", "Autre/inconnu", uid, gid);
    }
}