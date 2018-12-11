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

const computeSquare = (x0, y0, s, grid) =>
    reduceBounds(getBounds(x0, y0, s, s), (x, y, sum) => sum + grid[y - 1][x - 1], 0);


const getMaxSquare = (w, h, squareSize, grid) => {
    const bounds = {minY: 1, maxY: h - squareSize - 1, minX: 1, maxX: w - squareSize - 1};

    //console.log(bounds)

    let [maxLevel, maxX, maxY] = [-Infinity, -1, -1];
    loopBounds(bounds, (x, y) => {
        const level = computeSquare(x, y, squareSize, grid);
        if (level > maxLevel) {
            [maxLevel, maxX, maxY] = [level, x, y];
        }
    });
    return {x: maxX, y: maxY, level: maxLevel, squareSize: squareSize};
};

const getMaxPower = (serial, squareSize) => {
    const [w, h] = [300, 300];
    return getMaxSquare(w, h, squareSize, createGrid(w, h, serial));
};

const getMaxPowerVarySquare = (serial) => {
    return [...Array(300).keys()]
        .map(s => s + 1)
        .reduce((acc, size) => {
            //console.log(size)
            const res = getMaxPower(serial, size);
            return (res.level > acc.level)
                ? res
                : acc;
        }, {level: -Infinity});
};


const examples = [
    {serial: 18, x: 33, y: 45, level: 29},
    {serial: 42, x: 21, y: 61, level: 30}
];

examples.forEach(e => {
    const res = getMaxPower(e.serial, 3);
    console.log(res.x === e.x && res.y === e.y && res.level === e.level);
});


const max = getMaxPower(5153, 3);
console.log(`Part 1: coord = ${max.x},${max.y}`);


const examples2 = [
    {serial: 18, x: 90, y: 269, level: 113, size: 16}
    //{serial: 42, x: 232, y: 251, level: 119, size: 12}
];

/*
//SLOOOOOOW (~~15-20 min)

examples2.forEach(e => {
    const res = getMaxPowerVarySquare(e.serial);
    console.log(res.x === e.x && res.y === e.y && res.level === e.level && res.squareSize === e.size);
});

const max2 = getMaxPowerVarySquare(5153);
console.log(`Part 2: coord = ${max2.x},${max2.y},${max2.squareSize}`);

*/