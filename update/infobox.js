const fs = require('fs');
const axios = require("axios");
const WikiTextParser = require('parse-wikitext');
const parser = new WikiTextParser("mlp.fandom.com");

console.log("Gathering infobox for each page...");

(async () => {
    let infoboxes = {};
    for (let page of JSON.parse(fs.readFileSync("./data/pages.json").toString())) {
        console.log("Gathering infobox for '" + page.name + "'...");
        try {
            let data = (await axios.get("https://mlp.fandom.com/api.php?action=query&prop=revisions&titles=" + page.name + "&rvslots=*&rvprop=content&formatversion=2&format=json")).data;
            let mwextracts = (await axios.get("https://mlp.fandom.com/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=" + encodeURI(page.name) + "&redirects=")).data;
            let mwtext = (await axios.get("https://mlp.fandom.com/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&titles=" + encodeURI(page.name) + "&redirects=")).data;
            let extracts = "";
            try {
                sentences = mwextracts.query.pages[Object.keys(mwextracts.query.pages)[0]].extract.trim().replace(/(.*)\n(.*)/, "$2").replace(/(.*)\n\n(.*)/gm, "$2").replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
                extracts = sentences[0];
                if (extracts.length < 150 && sentences.length > 1) {
                    extracts = sentences[0] + " " + sentences[1];
                    if (extracts.length < 150 && sentences.length > 2) {
                        extracts = sentences[0] + " " + sentences[1] + " " + sentences[2];
                    }
                }
            } catch (e) {
                extracts = "";
            }
            let extracts_fr = extracts;
            if (fs.existsSync("./modules/translate.php")) {
                try {
                    extracts_fr = require('child_process').spawnSync("php", [ "translate.php", extracts ], { cwd: "./modules" }).stdout.toString()
                } catch (e) {
                    extracts_fr = extracts;
                }
            } else {
                extracts_fr = extracts;
            }
            if (data.query.pages.length > 0) {
                console.log("Results found, adding name to database")
                sections = parser.pageToSectionObject(data.query.pages[0].revisions[0].slots.main.content);
                box = parser.parseInfoBox(sections["content"]);
                if (box.template === "Infobox character") {
                    infoboxes[page.name] = parser.parseInfoBox(sections["content"]).values;
                    infoboxes[page.name]["_extract"] = extracts;
                    infoboxes[page.name]["_extract_fr"] = extracts_fr;
                }
            } else {
                console.log("No results found, ignoring name");
            }
            try {
                if (mwtext.query.pages[Object.keys(mwextracts.query.pages)[0]].extract.toLowerCase().includes("friendship is magic")
                 || mwtext.query.pages[Object.keys(mwextracts.query.pages)[0]].extract.toLowerCase().includes("fim")
                ) {
                    infoboxes[page.name]["_gen"] = 4;
                } else if (mwtext.query.pages[Object.keys(mwextracts.query.pages)[0]].extract.toLowerCase().includes("a new generation")
                        || mwtext.query.pages[Object.keys(mwextracts.query.pages)[0]].extract.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g, " ").toLowerCase().split(" ").includes("ang")
                        || mwtext.query.pages[Object.keys(mwextracts.query.pages)[0]].extract.replace(/[.,?!;()"'-]/g, " ").replace(/\s+/g, " ").toLowerCase().split(" ").includes("ang")
                ) {
                    infoboxes[page.name]["_gen"] = 5;
                } else {
                    infoboxes[page.name]["_gen"] = -1;
                }
            } catch(e) {}
        } catch (e) {
            console.error(e);
        }
    }

    fs.writeFileSync("./data/boxes.json", JSON.stringify(infoboxes, null, 4))
})()