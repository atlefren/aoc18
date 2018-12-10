const readLines = require('../index.js');

const parseData = data => {
    const re = /(\d*) players; last marble is worth (\d*) points(: high score is (\d*))?/;
    const match = re.exec(data);
    return {
        players: parseInt(match[1], 10),
        last: parseInt(match[2], 10),
        hs: parseInt(match[4], 10)
    };
};

const create = value => {
    const initMarble = createMarble(value);
    initMarble.next = initMarble;
    initMarble.prev = initMarble;
    return initMarble;
};

const createMarble = (marbleNr) => ({
    marbleNr: marbleNr,
    prev: null,
    next: null
});

const back = (node, times) => [...Array(times).keys()].reduce(n => n.prev, node);

const insertAfter = (node, newNode) => {
    newNode.next = node.next;
    newNode.prev = node;
    node.next.prev = newNode;
    node.next = newNode;
};

const insertTwoAfter = (node, newNode) => insertAfter(node.next, newNode);

const remove = node => {
    node.prev.next = node.next;
    node.next.prev = node.prev;
};

const getPlayer = (line, numPlayers) => {
    const player = line % numPlayers;
    if (player === 0) {
        return numPlayers;
    }
    return player;
};

const isDivisible32 = number => number % 23 === 0;

const playGame = (numPlayers, lastScore) => {

    const players = {};
    let current = create(0);
    for (let marbleNr = 1; marbleNr < lastScore; marbleNr++) {
        if (isDivisible32(marbleNr)) {
            const del = back(current, 7);
            const player = getPlayer(marbleNr, numPlayers);
            players[player] = (players[player] || 0) + marbleNr + del.marbleNr;
            current = del.next;
            remove(del);
        } else {
            const newMarble = createMarble(marbleNr);
            insertTwoAfter(current, newMarble);
            current = newMarble;
        }

    }
    return players;
};

const max = scores => Math.max(...Object.values(scores));

/*
readLines('testdata.txt', d => d).then(res => res.map(parseData)).then(data => {

    data.forEach(g => {
        console.log('players: ', g.players, ' last: ', g.last);
        const scores = playGame(g.players, g.last);
        console.log(max(scores) === g.hs);
    });

});
*/

readLines('input.txt', d => d).then(res => parseData(res[0])).then(g => {
    const scores1 = playGame(g.players, g.last);
    console.log(`Part 1: high score = ${max(scores1)}`);

    const scores2 = playGame(g.players, g.last * 100);
    console.log(`Part 2: high score = ${max(scores2)}`);
});