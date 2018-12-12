const readLines = require('../index.js');

const parseInput = input => ({
    initialState: input
        .shift()
        .replace('initial state: ', '')
        .split('')
        .map((v, i) => ({i: i, alive: v === '#'})),
    notes: parseNotes(input.slice(1))
});

const parseNotes = notes => notes
    .filter(note => note.endsWith(' => #'))
    .map(note => note.replace(' => #', ''));

const survives = (neighbourhood, notes) => notes.indexOf(neighbourhood) > -1;

const getNeighbour = (potId, state) => {
    const found = state.find(p => p.i === potId);

    return Boolean(found)
        ? found
        : {i: potId, alive: false};
};

const getNeighbourhood = (potId, state) => {

    const neighbours = [];
    for (let i = potId - 2; i <= potId + 2; i++) {
        neighbours.push(getNeighbour(i, state));
    }
    return neighbours.map(p => p.alive ? '#' : '.').join('');
};

const nextGen = (state, notes) => {

    const res = [];
    for (let potId = state[0].i - 2; potId < state.length; potId++) {
        const neighbourhood = getNeighbourhood(potId, state);
        res.push({i: potId, alive: survives(neighbourhood, notes)});
    }
    return res;
};


const advance = (numGenerations, initialState, notes) => [...Array(numGenerations).keys()]
    .reduce(state => {
        const newState = nextGen(state, notes);
        return newState;
    }, initialState);

const sumPots = pots => pots
    .filter(pot => pot.alive)
    .map(pot => pot.i)
    .reduce((sum, id) => sum + id, 0);

readLines('input.txt', a => a).then(parseInput).then(input => {
    const {initialState, notes} = input;
    const sum = sumPots(advance(20, initialState, notes));
    console.log(`Part 1: Sum = ${sum}`);
    console.log(sum === 1184);


    //console.log(`Part 2: Sum = ${sumPots(advance(40, initialState, notes))}`);
});