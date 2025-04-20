const fs = require('fs');
const axios = require('axios');

console.log("Parsing infobox data...");

let ponies = {};

(async () => {
    for (let title in JSON.parse(fs.readFileSync("./data/boxes.json").toString())) {
        console.log("Parsing " + title + "...");
        let box = JSON.parse(fs.readFileSync("./data/boxes.json").toString())[title];
        let data = {
            names: [title],
            extract: "",
            extract_fr: "",
            generation: -1,
            color: "000000",
            image: "https://example.com",
            kind: "Pony",
            sex: "Unknown",
            occupation: ["Unknown"],
            residence: ["Unknown"],
            mark: "https://example.com"
        }

        if (typeof box._gen !== "undefined") data.generation = box._gen;

        if (typeof box.name2 !== "undefined") data.names.push(box.name2.replace(/<!--[\s\S]*?-->/g, ""));
        if (typeof box.name3 !== "undefined") data.names.push(box.name3.replace(/<!--[\s\S]*?-->/g, ""));
        if (typeof box.name4 !== "undefined") data.names.push(box.name4.replace(/<!--[\s\S]*?-->/g, ""));
        if (typeof box.name5 !== "undefined") data.names.push(box.name5.replace(/<!--[\s\S]*?-->/g, ""));

        if (typeof box.nicknames !== "undefined") {
            box.nicknames.replace(/<!--[\s\S]*?-->/g, "").split(",").filter(e => !e.match(/[^a-zA-Z0-9-_ ]/gm)).forEach((e, i) => {
                data.names.push(e.trim());
            });
        }

        if (typeof box.kind !== "undefined") {
            kp = box.kind.replace(/<!--[\s\S]*?-->/g, "").replace(/[^a-zA-Z0-9-_ ]/gm, "").split(" ")[0];
            data.kind = kp.substr(kp.replace(/([A-Z])([a-z0-9]*)$/g, "").length);
        }
        if (typeof box.sex !== "undefined") data.sex = box.sex.replace(/<!--[\s\S]*?-->/g, "").trim().startsWith("F") ? "F" : "M";
        if (typeof box._extract !== "undefined") {
            data.extract = box._extract;
        }
        if (typeof box._extract_fr !== "undefined") {
            data.extract_fr = box._extract_fr.replace(/ma petite amitié de poney est la magie/gmi, "My Little Pony Friendship is Magic").replace(/Mon amitié avec mon petit poney est magique/gmi, "My Little Pony Friendship is Magic").replace(/Mon petit Poney/gmi, "My Little Pony").replace(/Mon Petit Poney Une Nouvelle Génération/gmi, "My Little Pony A New Generation").replace(/Mon petit poney : une nouvelle génération/gmi, "My Little Pony: A New Generation").replace(/pegasus/gmi, "pégase").replace(/alicorn[^e]/gmi, "alicorne").replace(/une poney/gmi, "une ponette").replace(/petite génération de poney 5/gmi, "Génération 5");
        } else {
            data.extract_fr = data.extract;
        }
        if (typeof box.coat !== "undefined") data.color = box.coat.replace(/<!--[\s\S]*?-->/g, "").trim().replace(/\[([a-z.\/ \nA-Z0-9:]*)\/(.{6})\/ (.*)\]/gm, "$2").replace(/{{perbang\|([0-9A-Fa-f].{5})(.*)/g, "$1");
        if (typeof box.main !== "undefined") data.image = "https://mlp.fandom.com/Special:FilePath/" + encodeURI(box.main.replace(/<!--[\s\S]*?-->/g, "").trim());
        if (typeof box.main1 !== "undefined") data.image = "https://mlp.fandom.com/Special:FilePath/" + encodeURI(box.main1.replace(/<!--[\s\S]*?-->/g, "").trim());
        if (typeof box.image !== "undefined") data.image = "https://mlp.fandom.com/Special:FilePath/" + encodeURI(box.image.replace(/<!--[\s\S]*?-->/g, "").trim());
        if (typeof box["cutie mark"] !== "undefined") {
            try {
                data.markimg = box["cutie mark"].replace(/<!--[\s\S]*?-->/g, "").trim().split("[[File:")[1].split("|")[0];
            } catch (e) {
                data.markimg = box["cutie mark"].replace(/<!--[\s\S]*?-->/g, "").trim().split("[[File:")[0].split("|")[0];
            }
            data.mark = "https://mlp.fandom.com/Special:Redirect/file/" + encodeURI(data.markimg) + "?width=128";
        }

        if (typeof box.occupation !== "undefined") {
            occupations = [];
            box.occupation/*.replace(/\[\[(.*)_(.*)\]\]|\[\[(.*)\|(.*)\]\]|\[\[(.*)\]\]/gm, "$2$4$5")*/.replace(/<!--[\s\S]*?-->/g, "").trim().replace(/\|/gm, "_").replace(/<( ||(|| )\/)( ||(|| )\/)(b|B)(r|R)( ||(|| )\/)( ||(|| )\/)>/gm, "|").replace(/( \|| \| | \| )/gm, "|").split("|").forEach((e) => {
                occupations.push(e.trim().replace(/[\[\]]/gm, "").replace(/<(.*)>/gm, "").replace(/([a-zA-Z0-9 \-_,.'"]*)_([a-zA-Z0-9 \-_,.'"]*)/gm, "$2"));
            })
            data.occupation = occupations;
        }
        if (typeof box.residence !== "undefined") {
            residences = [];
            box.residence/*.replace(/\[\[(.*)_(.*)\]\]|\[\[(.*)\|(.*)\]\]|\[\[(.*)\]\]/gm, "$2$4$5")*/.replace(/<!--[\s\S]*?-->/g, "").trim().replace(/\|/gm, "_").replace(/<( ||(|| )\/)( ||(|| )\/)(b|B)(r|R)( ||(|| )\/)( ||(|| )\/)>/gm, "|").replace(/( \|| \| | \| )/gm, "|").split("|").forEach((e) => {
                residences.push(e.trim().replace(/[\[\]]/gm, "").replace(/<(.*)>/gm, "").replace(/([a-zA-Z0-9 \-_,.'"]*)_([a-zA-Z0-9 \-_,.'"]*)/gm, "$2"));
            })
            data.residence = residences.replaceAll("Locations#", "");
        }

        if ((typeof box.name2 !== "undefined" || typeof box.name3 !== "undefined" || typeof box.name4 !== "undefined" || typeof box.name5 !== "undefined" || typeof box.coat !== "undefined" || typeof box.occupation !== "undefined" || typeof box.residence !== "undefined") && typeof box.sex !== "undefined") ponies[title] = data;
    }
})()

fs.writeFileSync("./data/data.json", JSON.stringify(ponies, null, 4));