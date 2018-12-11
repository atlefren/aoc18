const readLines = require('../index.js');


const parsePoint = step => {
    const re = /position=<(.*)> velocity=<(.*)>/;
    const match = re.exec(step);
    const position = match[1].split(', ');
    const velocity = match[2].split(', ');

    return {
        pos: {
            x: parseInt(position[0], 10),
            y: parseInt(position[1], 10)
        },
        vel: {
            x: parseInt(velocity[0], 10),
            y: parseInt(velocity[1], 10)
        }
    };
};

const readPoints = filename => readLines(filename, parsePoint);


const max = scores => Math.max(...Object.values(scores));
const min = scores => Math.min(...Object.values(scores));

const getBounds = points => {

    const x = points.map(p => p.x);
    const y = points.map(p => p.y);

    return {
        minX: min(x),
        maxX: max(x),
        minY: min(y),
        maxY: max(y)
    };
};

const normalize = (p, bounds) => ({
    x: p.x - bounds.minX,
    y: p.y - bounds.minY
});

const drawPositions = (positions, bounds) => {
    const w = (bounds.maxX - bounds.minX) + 1;
    const h = (bounds.maxY - bounds.minY) + 1;

    const canvas = [...Array(h).keys()].map(h => [...Array(w).keys()].map(w => '.'));

    const drawn = positions.reduce((c, p) => {
        const n = normalize(p, bounds);
        c[n.y][n.x] = '#';
        return c;
    }, canvas);

    return drawn.map(r => r.join('')).join('\n');
};

const getPositionsAt = (points, time) => points.map(p => ({
    x: p.pos.x + p.vel.x * time,
    y: p.pos.y + p.vel.y * time
}));


const getTimeWhenSmallest = points => {
    let prevW = Infinity;
    let prevH = Infinity;

    let t = 0;
    while (true) {
        const bounds = getBounds(getPositionsAt(points, t));
        const w = (bounds.maxX - bounds.minX) + 1;
        const h = (bounds.maxY - bounds.minY) + 1;

        if (w > prevW && h > prevH) {
            break;
        }
        prevW = w;
        prevH = h;

        t++;
    }
    return t - 1;
};

const readMessage = (points, time) => {
    const positions = getPositionsAt(points, time);
    const bounds = getBounds(positions);
    return drawPositions(positions, bounds);
};

readPoints('input.txt').then(points => {
    const time = getTimeWhenSmallest(points);

    console.log('Part 1:');
    console.log(readMessage(points, time));

    console.log(`Part 2: time = ${time}`);
});
