const axios = require("axios");
const fs = require("fs");

if (fs.existsSync("./data")) fs.rmSync("./data", { recursive: true });
fs.mkdirSync("./data");

(async () => {
    async function getCategory(category) {
        console.log("Category:" + category);
        let cat = (await axios.get("https://mlp.fandom.com/api.php?action=query&generator=categorymembers&gcmtitle=Category:" + encodeURI(category) + "&prop=categories&cllimit=max&gcmlimit=max&format=json")).data;

        return Object.keys(cat.query.pages).map(k => cat.query.pages[k].title).filter(k => !k.startsWith("List") && !k.includes("EG") && !k.toLowerCase().includes("ponies") && !k.includes(" and ") && !k.includes("(") && !k.includes("family"));
    }

    let list = [...new Set([
        ...(await getCategory("Pegasus ponies")),
        ...(await getCategory("Alicorn ponies")),
        ...(await getCategory("Earth ponies")),
        ...(await getCategory("Unicorn ponies")),
        ...(await getCategory("Main characters")),
        ...(await getCategory("Dragons")),
    ])];
    fs.writeFileSync("./data/list.json", JSON.stringify(list, null, 4))
})()