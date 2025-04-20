const db = require('../data/search.json').associations;
const list = Object.keys(require('../data/data.json'));
const Fuse = require('fuse.js');

module.exports = (query) => {
    const fuse = new Fuse(db, {
        keys: [ 'title', 'endpoint' ]
    })

    let results = [];
    for (let item of fuse.search(query)) {
        results.push(item.item.endpoint);
    }

    if (fuse.search(query).length > 0) {
        exact = fuse.search(query)[0].item.endpoint;
    } else {
        exact = null;
    }

    let first = [
        null,
        null,
        null
    ]

    findex = 0;
    for (let result of fuse.search(query)) {
        if (!first.includes(result.item.endpoint) && findex < 3 && list.includes(result.item.endpoint)) {
            first[findex] = result.item.endpoint
            findex++
        }
    }

    return {
        results,
        first,
        exact
    };
}