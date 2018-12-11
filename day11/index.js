const hundreds = number => Math.floor((number / 100) % 10);

const getPowerLevel = (x, y, serial) =>
    hundreds(((y * (x + 10)) + serial) * (x + 10)) - 5;

const reduceBounds = (bounds, fn, init) => {
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
        for (let x = bounds.minX; x <= bounds.maxX; x++) {
            init = fn(x, y, init);
        }
    }
    return init;
};

const loopBounds = (bounds, fn) => reduceBounds(bounds, fn);


const emptyGrid = (w, h) =>
    [...Array(h).keys()].map(h => [...Array(w).keys()].map(w => null));

const createGrid = (w, h, serial) => reduceBounds(getBounds(1, 1, h, w), (x, y, acc) => {
        acc[y - 1][x - 1] = getPowerLevel(x, y, serial);
        return acc;
    }, emptyGrid(w, h));


const getBounds = (x0, y0, w, h) => ({
    minY: y0,
    maxY: y0 + h - 1,
    minX: x0,
    maxX: x0 + w - 1
});

const computeSquare = (x0, y0, grid) =>
    reduceBounds(getBounds(x0, y0, 3, 3), (x, y, sum) => sum + grid[y - 1][x - 1], 0);


const getMaxSquare = (w, h, grid) => {
    const bounds = {minY: 1, maxY: h - 2, minX: 1, maxX: w - 2};
    let [maxLevel, maxX, maxY] = [-Infinity, -1, -1];
    loopBounds(bounds, (x, y) => {
        const level = computeSquare(x, y, grid);
        if (level > maxLevel) {
            [maxLevel, maxX, maxY] = [level, x, y];
        }
    });
    return {x: maxX, y: maxY, level: maxLevel};
};



const getMaxPower = (w, h, serial) => {
    return getMaxSquare(w, h, createGrid(w, h, serial));
};


const examples = [
    {serial: 18, x: 33, y: 45, level: 29},
    {serial: 42, x: 21, y: 61, level: 30}
];

examples.forEach(e => {
    const res = getMaxPower(300, 300, e.serial);
    console.log(res.x === e.x && res.y === e.y && res.level === e.level);
});


const max = getMaxPower(300, 300, 5153);
console.log(`Part 1: coord = ${max.x},${max.y}`);
