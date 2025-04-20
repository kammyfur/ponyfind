const fs = require('fs');
const db = JSON.parse(fs.readFileSync("./data/data.json").toString());

const icons = require('./icons.js');

module.exports = (pony) => {
    sel = db[pony];
    switch (d.kind) {
        case "Pegasus":
            return icons.kind.pegasus;

        case "Earth":
            return icons.kind.earth;

        case "Unicorn":
            return icons.kind.unicorn;

        case "Alicorn":
            return icons.kind.alicorn;

        default:
            return icons.kind.other;
    }
}