const fs = require('fs');

module.exports = {
    kind: {
        alicorn: fs.readFileSync("./config/icons/kind_alicorn.txt").toString().trim(),
        earth: fs.readFileSync("./config/icons/kind_earth.txt").toString().trim(),
        other: fs.readFileSync("./config/icons/kind_other.txt").toString().trim(),
        pegasus: fs.readFileSync("./config/icons/kind_pegasus.txt").toString().trim(),
        unicorn: fs.readFileSync("./config/icons/kind_unicorn.txt").toString().trim(),
    },
    generations: {
        g4: fs.readFileSync("./config/icons/gen_4.txt").toString().trim(),
        g5: fs.readFileSync("./config/icons/gen_5.txt").toString().trim(),
        other: fs.readFileSync("./config/icons/gen_unknown.txt").toString().trim(),
    }
}