const readline = require('readline');
const fs = require('fs');


const getReadInterface = filename => readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
});

const readLines = (filename, mapper) => new Promise(resolve => {
    const lines = [];
    getReadInterface(filename)
        .on('line', (line) => {
            lines.push(mapper(line));
        })
        .on('close', () => {
            resolve(lines);
        });
});


module.exports = readLines;