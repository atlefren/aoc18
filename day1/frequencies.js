const readLines = require('../index.js');

const readChanges = filename => readLines(filename, i => parseInt(i, 10));

const getNextFrequency = (frequency, change) => frequency + change;


const findFirstDouble = changes => {
    const frequencies = new Set();
    let frequency = 0;
    let i = -1;
    while (true) {
        i = (i >= changes.length - 1) ? 0 : i + 1;
        frequency = getNextFrequency(frequency, changes[i]);
        if (frequencies.has(frequency)) {
            return frequency;
        }
        frequencies.add(frequency);
    }
};






readChanges('input.txt').then(changes => {
    const initialFrequency = 0;

    const finalFrequency = changes.reduce(getNextFrequency, initialFrequency);
    //console.log(`finalFrequency = ${finalFrequency}`);

    console.time('time');
    console.log(`first double = ${findFirstDouble(changes)}`);
    console.timeEnd('time');
});