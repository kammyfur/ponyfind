const fs = require('fs');
const Fuse = require('fuse.js');
const list = fs.readdirSync("./pixel");

const fuse = new Fuse(list);

module.exports = (pony) => {
    dir = fuse.search(pony)[0].item;
    files = fs.readdirSync("./pixel/" + dir + "/");

    if (fs.existsSync("./pixel/" + dir + "/stand_left.gif")) {
        return "./pixel/" + dir + "/stand_left.gif";
    } else {
        for (let item of files) {
            if (item.includes("stand_") && item.includes("left") && (item.includes(".gif") || item.includes(".png"))) {
                return "./pixel/" + dir + "/" + item;
            }
        }
    }

    const flst = new Fuse(files);
    file = flst.search("stand_left.gif")[0].item;

    return "./pixel/" + dir + "/" + file;
}