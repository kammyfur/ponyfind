const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const data = require('../data/data.json');

const getKindIcon = require("./kind");
const getGeneration = require("./generation");
const customEmoji = require('./emoji');
const cuties = fs.readFileSync("./config/cuties.txt").toString();

module.exports = (page, id, gid, isPublic, user, member, guild) => {
    if (typeof data[page] === "undefined") {
        return false;
    }

    d = data[page];

    let sign = "";
    switch (page) {
        case "Rainbow Dash":
            sign = "🌈";
            break;

        case "Twilight Sparkle":
            sign = "✨";
            break;

        case "Pinkie Pie":
            sign = "🎈";
            break;

        case "Applejack":
            sign = "🍎";
            break;

        case "Fluttershy":
            sign = "😔";
            break;

        case "Rarity":
            sign = "🦄";
            break;

        case "Scootaloo":
        case "Babs Seed":
        case "Apple Bloom":
        case "Sweetie Belle":
            sign = customEmoji(cuties.trim(), member, guild);
            break;

        default:
            sign = "";
            break;
    }

    let kind = l("Unknown", "Inconnu", id, gid);
    switch (d.kind) {
        case "Pegasus":
            kind = l("Pegasus", "Pégase", id, gid)
            break;

        case "Earth":
            kind = l("Earth Pony", "Poney terrestre", id, gid)
            break;

        case "Ahuizotl":
            kind = l("Ahiuzotl", "Ahuizotl", id, gid)
            break;

        case "Rabbit":
            kind = l("Rabbit", "Lapin", id, gid)
            break;

        case "Pony":
            kind = l("Pony", "Poney", id, gid)
            break;

        case "Unicorn":
            kind = l("Unicorn", "Licorne", id, gid)
            break;

        case "Draconequus":
            kind = l("Draconequus", "Draconequus", id, gid)
            break;

        case "Griffon":
            kind = l("Griffon", "Gryphon", id, gid)
            break;

        case "Alligator":
            kind = l("Alligator", "Alligator", id, gid)
            break;

        case "Minotaur":
            kind = l("Minotaur", "Minotaure", id, gid)
            break;

        case "Buffalo":
            kind = l("Buffalo", "Buffle", id, gid)
            break;

        case "Alicorn":
            kind = l("Alicorn", "Alicorne", id, gid)
            break;

        case "Persian":
            kind = l("Persian", "Persien", id, gid)
            break;

        case "Owl":
            kind = l("Owl", "Hibou", id, gid)
            break;

        case "Phoenix":
            kind = l("Phoenix", "Phénix", id, gid)
            break;

        case "Changelingbr":
            kind = l("Changelingbr", "Changelingbr", id, gid)
            break;

        case "Breezie":
            kind = l("Breezie", "Brisie", id, gid)
            break;

        case "Dragon":
            kind = l("Dragon", "Dragon", id, gid)
            break;

        case "Sea":
            kind = l("Sea", "Mer", id, gid)
            break;

        case "Tortoise":
            kind = l("Tortoise", "Tortue", id, gid)
            break;

        case "Centaurref":
            kind = l("Centaurref", "Centaurref", id, gid)
            break;

        case "Collie":
            kind = l("Collie", "Collie", id, gid)
            break;

        case "Zebrabr":
            kind = l("Zebrabr", "Zebrabr", id, gid)
            break;
    }

    names = [...new Set(d.names.filter(e => e.trim().toLowerCase() !== page.toLowerCase()))];

    let naming = "-";
    if (names.length > 5) {
        naming = "- " + names[0] + "\n- " + names[1] + "\n- " + names[2] + "\n- " + names[3] + "\n- " + names[4] + "\n*" + l("and " + (names.length - 5) + " others", "et " + (names.length - 5) + " autres", id, gid) + "*"
    } else {
        if (names.length > 1) {
            naming = "- " + names.join("\n- ")
        } else {
            naming = names[0];
        }
    }

    if (typeof naming === "undefined" || naming.trim() === "") {
        naming = "-";
    }

    let jobs = page;
    if (d.occupation.length > 5) {
        jobs = "- " + d.occupation[0] + "\n- " + d.occupation[1] + "\n- " + d.occupation[2] + "\n- " + d.occupation[3] + "\n- " + d.occupation[4] + "\n*" + l("and " + (d.occupation.length - 5) + " others", "et " + (d.occupation.length - 5) + " autres", id, gid) + "*"
    } else {
        if (d.occupation.length > 1) {
            jobs = "- " + d.occupation.join("\n- ")
        } else {
            jobs = d.occupation[0];
        }
    }

    let location = page;
    if (d.residence.length > 5) {
        location = "- " + d.residence[0] + "\n- " + d.residence[1] + "\n- " + d.residence[2] + "\n- " + d.residence[3] + "\n- " + d.residence[4] + "\n*" + l("and " + (d.residence.length - 5) + " others", "et " + (d.residence.length - 5) + " autres", id, gid) + "*"
    } else {
        if (d.residence.length > 1) {
            location = "- " + d.residence.join("\n- ")
        } else {
            location = d.residence[0];
        }
    }

    let fields = [
        { name: l("Nicknames", "Surnoms", id, gid), value: naming, inline: true },
        { name: l("Sex", "Sexe", id, gid), value: d.sex === "F" ? "♀ " + l("Female", "Fille", id, gid) : "♂ " + l("Male", "Garçon", id, gid), inline: true },
        { name: l("Kind", "Type", id, gid), value: customEmoji(getKindIcon(page), member, guild) + " " + kind, inline: true },
        { name: l("Generation", "Génération", id, gid), value: getGeneration(page, id, gid, member, guild), inline: true },
    ];

    if (spoils[id] === 1 && !isPublic) {
        fields.push(
            { name: l("Occupation(s)", "Occupation(s)", id, gid), value: "(" + l("spoilers", "révélations", id, gid) + ")\n||" + jobs + "||", inline: false },
            { name: l("Home(s)", "Résidence(s)", id, gid), value: "(" + l("spoilers", "révélations", id, gid) + ")\n||" + location + "||", inline: false }
        )
    } else if (spoils[id] === 2 && !isPublic) {
        fields.push(
            { name: l("Occupation(s)", "Occupation(s)", id, gid), value: jobs, inline: true },
            { name: l("Home(s)", "Résidence(s)", id, gid), value: location, inline: true }
        )
    }

    let footer = "";
    if (isPublic) {
        footer = l("Content provided without warranty, use at your own risk.\nRequested by " + user.tag, "Contenu fourni sans aucune garantie, utilisez à vos risques et périls\nDemandé par " + user.tag, id, gid)
    } else {
        footer = l("Content provided without warranty, use at your own risk.", "Contenu fourni sans aucune garantie, utilisez à vos risques et périls", id, gid)
    }

    return new MessageEmbed()
        .setColor(d.color.length === 6 ? d.color : "ffffff")
        .setTitle(page + " " + sign)
        .setDescription(d.extract)
        .setImage(d.image)
        .setThumbnail(d.mark)
        .addFields(fields)
        .setFooter({ text: footer })
}