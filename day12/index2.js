const readLines = require('../index.js');

const parseInput = input => ({
    initialState: input
        .shift()
        .replace('initial state: ', '')
        .split('')
        .map((v, i) => ({idx: i, alive: v === '#'})),
    notes: parseNotes(input.slice(1))
});

const parseNotes = notes => notes
    .filter(note => note.endsWith(' => #'))
    .map(note => note.replace(' => #', ''));

const survives = (neighbourhood, notes) => notes.indexOf(neighbourhood) > -1;

const createNode = ({idx, alive}) => ({idx, alive});

const createList = () => ({lastNode: null, firstNode: null});

const insertAfter = (list, node, newNode) => {
     newNode.prev = node;
     if (node.next === null) {
         newNode.next = null;
         list.lastNode = newNode;
    } else {
         newNode.next = node.next;
         node.next.prev = newNode;
    }
    node.next = newNode;
};

const insertBefore = (list, node, newNode) => {
     newNode.next = node;
     if (node.prev === null) {
         newNode.prev = null;
         list.firstNode = newNode;
    } else {
         newNode.prev = node.prev;
         node.prev.next = newNode;
    }
    node.prev = newNode;
};

const insertBeginning = (list, newNode) => {
     if (list.firstNode == null) {
         list.firstNode = newNode;
         list.lastNode = newNode;
         newNode.prev = null;
         newNode.next = null;
    } else {
        insertBefore(list, list.firstNode, newNode);
    }
};

const createPotList = state => {

    let node = createNode(state[0]);
    const list = createList();
    insertBeginning(list, node);

    for (let i = 1; i < state.length; i++) {
        const newNode = createNode(state[i]);
        insertAfter(list, node, newNode);
        node = newNode;
    }
    return list;
};


const printState = list => {
    const res = [];
    let node = list.firstNode;
    while (node) {
        res.push(node.alive ? '#' : '.');
        node = node.next;
    }
    return res.join('');
};


const getPrev = pot => Boolean(pot.prev)
    ? pot.prev
    : {
        idx: pot.idx - 1,
        alive: false,
        next: pot
    };


const getNext = pot => Boolean(pot.next)
    ? pot.next
    : {
        idx: pot.idx + 1,
        alive: false,
        prev: pot
    };


const getNeighbourhood = pot => {
    const l1 = getPrev(pot);
    const l2 = getPrev(l1);

    const r1 = getNext(pot);
    const r2 = getNext(r1);
    return [l2, l1, pot, r1, r2].map(p => p.alive ? '#' : '.').join('');
};


const nextGen = (list, notes) => {
    let node = list.firstNode;
    let newList = createList();
    let prevNode = null;
    while (node) {
        const n = getNeighbourhood(node);
        const alive = survives(n, notes);
        const newNode = createNode({idx: node.idx, alive});
        if (!prevNode) {
            insertBeginning(newList, newNode);
        } else {
            insertAfter(newList, prevNode, newNode);
        }
        prevNode = newNode;
        node = node.next;
    }

    //check left
    let first = getPrev(list.firstNode);
    if (survives(getNeighbourhood(first), notes)) {
        first.alive = true;
        insertBeginning(newList, first);
    };

    //check right
    let last = getNext(list.lastNode);
    if (survives(getNeighbourhood(last), notes)) {
        last.alive = true;
        insertAfter(newList, newList.lastNode, last);
    };

    return newList;
};

const advance = (numGenerations, initList, notes) => {

    let list = initList;
    for (let i = 0; i < numGenerations; i++) {
        list = nextGen(list, notes);
    }
    return list;

};

const sumPots = pots => {
    let pot = pots.firstNode;
    let sum = 0;
    while (pot) {
        if (pot.alive) {
            sum += pot.idx;
        }
        pot = pot.next;
    }
    return sum;
};

readLines('input.txt', a => a).then(parseInput).then(input => {

    const {initialState, notes} = input;

    console.time('linkedlist');
    const sum = sumPots(advance(20, createPotList(initialState), notes));
    console.log(`Part 1: Sum = ${sum}`);
    console.log(sum === 1184);
    console.timeEnd('linkedlist');

    /* will take 517 days approx?
    console.time('linkedlist2');
    const sum2 = sumPots(advance(50000000000, createPotList(initialState), notes));
    console.log(`Part 2: Sum = ${sum2}`);
    console.log(sum === 1184);
    console.timeEnd('linkedlist2');
    */ 
});