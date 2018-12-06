const readLines = require('../index.js');

const parseClaim = claim => {

    const arr = claim.split(' ');
    const lu = arr[2].replace(':', '').split(',').map(n => parseInt(n, 10));
    const wh = arr[3].split('x').map(n => parseInt(n, 10));
    return {
        id: arr[0].replace('#', 0),
        x: lu[0],
        y: lu[1],
        w: wh[0],
        h: wh[1]
    };
};

const readClaims = filename => readLines(filename, parseClaim);


const getPixels = extent => {
    const pixels = [];
    const startX = extent.x;
    const startY = extent.y;
    for (let i = 0; i < extent.w; i++) {
        for (let j = 0; j < extent.h; j++) {
            const x = startX + i;
            const y = startY + j;
            pixels.push(`${x},${y}`);
        }
    }
    return pixels;

};


const getBoard = claims => claims.reduce((board, claim) => {
    const pixels = getPixels(claim);

    pixels.forEach(p => {
       board[p] = (board[p] || 0) + 1;
    });
    return board;
}, {});


readClaims('input.txt').then(claims => {
    const board = getBoard(claims);
    console.log('c=', Object.values(board).filter(v => v > 1).length);

    const collisions = new Set(Object.keys(board).filter(k => board[k] > 1));
    const claim = claims.find(claim => !getPixels(claim).some(p => collisions.has(p)));

    console.log(claim.id);

});
