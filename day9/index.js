const readLines = require('../index.js');

const parseData = data => {
    const re = /(\d*) players; last marble is worth (\d*) points(: high score is (\d*))?/;
    const match = re.exec(data);
    return {
        players: parseInt(match[1], 10),
        last: parseInt(match[2], 10),
        hs: parseInt(match[3], 10)
    };
};

const createPlayers = numPlayers => [...Array(numPlayers + 1).keys()]
    .reduce((acc, nr) => ({...acc, [nr]: 0}), {});

const getIndexCW = (circle, current) => {
    let currentIdx = circle.indexOf(current);
    return (currentIdx + 1 === circle.length)
        ? 1
        : currentIdx + 2;
};

const getIndexCCW = (circle, current) => {
    const newIdx = circle.indexOf(current) - 7;
    return (newIdx < 0)
        ? circle.length + newIdx
        : newIdx;
};

const isDivisible32 = number => number % 23 === 0;

const printLine = (player, circle, marbleNr) => {
    const str = circle.map(m => m === marbleNr ? `(${m})` : ` ${m} `);
    console.log(`[${player}]\t ${str.join(' ')}`);
};

const playGame = (numPlayers, lastScore) => {

    const players = createPlayers(numPlayers);
    const circle = [0];

    let currentMarble = 0;
    let marbleNr = 0;
    while (true) {
        let player = 1;
        for (player = 1; player <= numPlayers; player++) {
            marbleNr++;

            if (isDivisible32(marbleNr)) {
                const removeIdx = getIndexCCW(circle, currentMarble);
                const score = marbleNr + circle[removeIdx];

                players[player] += score;

                circle.splice(removeIdx, 1);
                currentMarble = circle[removeIdx];

            } else {
                circle.splice(getIndexCW(circle, currentMarble), 0, marbleNr);
                currentMarble = marbleNr;
            }

            //printLine(player, circle, currentMarble);
            if (currentMarble > lastScore) {
                return players;
            }
        }
        player = 1;
    }

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
    const scores = playGame(g.players, g.last);
    console.log(`Part 1: high score = ${max(scores)}`);
});

