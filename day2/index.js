const readLines = require('../index.js');

const readIds = filename => readLines(filename, i => i);

const ids = [
    'abcde',
    'fghij',
    'klmno',
    'pqrst',
    'fguij',
    'axcye',
    'wvxyz',
    'fgaij'
];

const letterFrequencies = id => id.split('').reduce((acc, char) => {
        acc[char] = (acc[char] || 0) + 1;
        return acc;
    }, {});

const hasCount = (count, frequencies) => Object
    .values(frequencies)
    .filter(f => f === count)
    .length > 0;


const getChecksum = (ids, check) => {
    const counts = ids.reduce((acc, id) => {
        const frequencies = letterFrequencies(id);
        check.forEach(count => {
            acc[count] += hasCount(count, frequencies) ? 1 : 0;
        });
        return acc;

    }, {2: 0, 3: 0});
    return check.reduce((acc, num) => acc * counts[num], 1);
};


const equals = (id1, id2) => {
    if (id1.length !== id2.length) {
        return false;
    }

    let numDifferences = 0;
    for (let i = 0; i < id1.length; i++) {
        numDifferences += (id1[i] !== id2[i]) ? 1 : 0;
    }
    return numDifferences < 2;

};

const findCommon = ids => {
    const equal = new Set();
    for (let i = 0; i < ids.length; i++) {
        let id1 = ids[i];
        for (let j = i + 1; j < ids.length; j++) { 
            let id2 = ids[j];
            if (equals(id1, id2)) {

                equal.add(id1);
                equal.add(id2);
            }
        }
    }
    return Array.from(equal);
};

const removeAtIndex = (arr, idx) => arr.slice(0, idx).concat(arr.slice(idx + 1));

const comminString = ids => {
    console.log(ids);
    const id1 = ids[0].split('');
    const id2 = ids[1].split('');
    let i = 0;
    for (i = 0; i < id1.length; i++) {
        if (id1[i] !== id2[i]) {
            break;
        }
    }
    return removeAtIndex(id1, i).join('');

};


readIds('input.txt').then(ids => {
    console.log(`checksum = ${getChecksum(ids, [2, 3])}`);
    console.log(comminString(findCommon(ids)));
});


//findCommon(ids);
