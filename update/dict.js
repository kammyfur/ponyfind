const fs = require('fs');

console.log("Optimizing search engine...");

let search = {
    entries: null,
    associations: []
}

global.knownAssociations = [];

for (let page of JSON.parse(fs.readFileSync("./data/pages.json").toString())) {
    if (!knownAssociations.includes(page.name.toLowerCase().replace(/[^a-z]/gm, " ").replace(/\s\s+/g, " ").trim())) {
        knownAssociations.push(page.name.toLowerCase().replace(/[^a-z]/gm, " ").replace(/\s\s+/g, " ").trim());
        search.associations.push({
            title: page.name.toLowerCase().replace(/[^a-z]/gm, " ").replace(/\s\s+/g, " ").trim(),
            endpoint: page.name
        });
    }

    if (typeof JSON.parse(fs.readFileSync("./data/data.json").toString())[page.name] !== "undefined") {
        for (let nick of JSON.parse(fs.readFileSync("./data/data.json").toString())[page.name].names) {
            if (!knownAssociations.includes(nick.toLowerCase().replace(/[^a-z]/gm, " ").replace(/\s\s+/g, " ").trim())) {
                knownAssociations.push(nick.toLowerCase().replace(/[^a-z]/gm, " ").replace(/\s\s+/g, " ").trim());
                search.associations.push({
                    title: nick.toLowerCase().replace(/[^a-z]/gm, " ").replace(/\s\s+/g, " ").trim(),
                    endpoint: page.name
                });
            }
        }
    }
}

search.entries = [];
for (let association of search.associations) {
    search.entries.push(association.title);
}
search.entries = [...new Set(search.entries)];
fs.writeFileSync("./data/search.json", JSON.stringify(search, null, 4));

console.log(JSON.parse(fs.readFileSync("./data/pages.json").toString()).length + " known characters");