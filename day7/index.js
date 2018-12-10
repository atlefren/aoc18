const readLines = require('../index.js');


const parseStep = step => {
    const re = /Step ([A-Z]) must be finished before step ([A-Z]) can begin./;
    const match = re.exec(step);
    return {
        id: match[2],
        before: match[1]
    };
};

const readSteps = filename => readLines(filename, parseStep);

const getStart = steps => {
    const ids = new Set(steps.map(s => s.id));
    const depends = new Set(steps.map(s => s.before));
    return [...depends].filter(x => !ids.has(x)).sort()[0];
};

const allSteps = steps => {
    const ids = new Set(steps.map(s => s.id));
    const depends = new Set(steps.map(s => s.before));
    return new Set([...ids, ...depends]);
};


const getUnused = (used, steps) => {
    const ids = allSteps(steps); //new Set(steps.map(s => s.id));
    const usedSet = new Set(used);
    return [...ids].filter(x => !usedSet.has(x));
};

const getDependencies = (id, steps) => {
    return steps.filter(s => s.id === id).map(s => s.before);
};

const getCandidates = (used, steps) => {
    const unused = getUnused(used, steps);
    const candidates = unused.filter(id => {
        const dependendies = getDependencies(id, steps);
        const isMet = !dependendies.some(d => unused.indexOf(d) > -1);
        return isMet;
    });
    return candidates;
};


const getNext = (used, steps) => {
    return getCandidates(used, steps).sort()[0];
};

const getOrder = steps => {
    const numSteps = allSteps(steps).size;
    const used = [];

    while (used.length < numSteps) {
        const next = getNext(used, steps);
        used.push(next);
    }
    return used.join('');
};


readSteps('input.txt').then(steps => {

    console.log(`Part 1: order = ${getOrder(steps)}`);
});
