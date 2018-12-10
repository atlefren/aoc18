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

const allSteps = steps => {
    const ids = new Set(steps.map(s => s.id));
    const depends = new Set(steps.map(s => s.before));
    return new Set([...ids, ...depends]);
};


const getUnused = (used, steps) => {
    const ids = allSteps(steps);
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
    return getCandidates(used, steps).sort();
};


const getOrder = steps => {
    const numSteps = allSteps(steps).size;
    const finished = [];

    while (finished.length < numSteps) {
        const next = getNext(finished, steps)[0];
        finished.push(next);
    }
    return finished.join('');
};

const getFreeWorkers = workers => workers
    .filter(worker => worker.timeRemaining <= 0)
    .map(worker => worker.id);


const updateWorkers = (workers, id, timeRemaining, workingOn) => workers
    .map(w => w.id === id
        ? {id: id, timeRemaining: timeRemaining, workingOn: workingOn}
        : w
    );


const advanceTime = workers => workers
    .map(w => ({...w, timeRemaining: w.timeRemaining - 1}));


const getTime = (task, addon) => 'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .indexOf(task.toLowerCase()) + 1 + addon;


const getInProgress = (workers) => workers
    .filter(w => w.timeRemaining > 0 && w.workingOn !== null)
    .map(w => w.workingOn);

const getCompleted = (workers) => workers
.filter(w => w.timeRemaining === 0 && w.workingOn !== null)
.map(w => w.workingOn);



const getTimeParalell = (steps, numWorkers, timeAdd) => {
    const numSteps = allSteps(steps).size;
    const finished = [];
    let tick = -1;

    let workers = [...Array(numWorkers).keys()].map((id) => ({
        id: id,
        timeRemaining: 0,
        workingOn: null
    }));

    while (finished.length < numSteps) {
        tick = tick + 1;
        finished.push(...getCompleted(workers));

        const freeWorkers = getFreeWorkers(workers);
        if (freeWorkers.length) {
            const inProgress = new Set(getInProgress(workers));
            const next = getNext(finished, steps).filter(id => !inProgress.has(id));
            for (var i = 0; i < next.length; i++) {
                const task = next[i];
                const worker = freeWorkers.shift();
                if (worker !== undefined) {
                    const time = getTime(task, timeAdd);
                    workers = updateWorkers(workers, worker, time, task);
                }
            }
        }
        workers = advanceTime(workers);
    }
    return tick;
};



readSteps('input.txt').then(steps => {
    console.log(`Part 1: order = ${getOrder(steps)}`);
    console.log(`Part 2: time = ${getTimeParalell(steps, 15, 60)}`);
});
