const readLines = require('../index.js');


const reacts = (a, b) => {
    if (a === b) {
        return false;
    }
    if (a.toLowerCase() === b.toLowerCase()) {
        return true;
    }
    return false;
};

const reduce = polymer => {

    let hasRemoved = false;
    for (let i = 0; i < polymer.length - 1; i++) {
        const a = polymer[i];
        const b = polymer[i + 1];
        if (reacts(a, b)) {
            polymer.splice(i, 2);
            hasRemoved = true;
        }
    }
    return hasRemoved ? reduce(polymer) : polymer;
};

const isOfType = (unit, type) => unit.toLowerCase() === type;

const removeUnits = (polymer, unitType) => polymer.filter(unit => !isOfType(unit, unitType));


readLines('input.txt', d => d).then(data => data[0]).then(polymer => {

    console.log(`Part 1: Remaining units ${reduce(polymer.split('')).length}`);

    const unitTypes = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const lengths = unitTypes
        .map(unitType => reduce(removeUnits(polymer.split(''), unitType)).length);
    console.log(`Part 2: Remaining units ${Math.min.apply(null, lengths)}`);
});
