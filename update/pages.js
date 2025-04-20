const fs = require('fs');
const axios = require('axios');

(async () => {
    console.log("Gathering pages list...");
    let pages = [];
    for (let page of JSON.parse(fs.readFileSync("./data/list.json").toString())) {
        console.log("Searching for '" + page + "'...");
        try {
            let data = (await axios.get("https://mlp.fandom.com/api.php?action=query&list=search&srsearch=" + encodeURI(page) + "&srlimit=1&srenablerewrites=true&format=json")).data;
            if (data.query.search.length > 0) {
                console.log("Results found, adding name to database")
                pages.push({
                    query: page,
                    name: data.query.search[0].title,
                    mwid: data.query.search[0].pageid,
                    words: data.query.search[0].wordcount,
                })
            } else {
                console.log("No results found, ignoring name");
            }
        } catch (e) {
            console.error(e);
        }
    }

    fs.writeFileSync("./data/pages.json", JSON.stringify(pages, null, 4))
})()