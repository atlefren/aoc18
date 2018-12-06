const readLines = require('../index.js');


const parseCoord = coord => {
    const split = coord.split(',');
    return {
        x: parseInt(split[0], 10),
        y: parseInt(split[1], 10)
    };
};

const readCoords = filename => readLines(filename, parseCoord);

const loopBounds = (bounds, fn) => {
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
        for (let x = bounds.minX; x <= bounds.maxX; x++) {
            fn(x, y);
        }
    }
};

const getBounds = coords => {
    const init = {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity
    };
    return coords.reduce((acc, coord) => {
        acc.minX = coord.x < acc.minX ? coord.x : acc.minX;
        acc.minY = coord.y < acc.minY ? coord.y : acc.minY;
        acc.maxX = coord.x > acc.maxX ? coord.x : acc.maxX;
        acc.maxY = coord.y > acc.maxY ? coord.y : acc.maxY;
        return acc;
    }, init);

};


const manhattanDist = (c1, c2) => Math.abs(c2.x - c1.x) + Math.abs(c2.y - c1.y);

const getClosestCoord = (coord, coords) => {
    let prevDist = Infinity;
    let closest = null;
    for (let i = 0; i < coords.length; i++) {
        let c2 = coords[i];
        let dist = manhattanDist(coord, c2);
        if (dist === prevDist) {
            closest = null;
            //break;
        }
        if (dist < prevDist) {
            prevDist = dist;
            closest = c2;
        }
    }
    return closest;
};


const assignId = coords => coords.map((coord, idx) => ({...coord, id: idx}));

const group = distances => {
    return distances.reduce((acc, distance) => {
        acc[distance.id] = acc[distance.id] || [];
        acc[distance.id].push(distance);
        return acc;
    }, {});

};

const touchesBounds = (coords, bounds) => {
    return coords.some(coord => coord.x === bounds.minX || coord.x === bounds.maxX || coord.y === bounds.minY || coord.Y === bounds.maxY);
};

const assignPoint = (coords, bounds) => {
    const distributed = [];
    loopBounds(bounds, (x, y) => {
        let coord = {x, y};
        let closest = getClosestCoord(coord, coords);
        if (closest !== null) {
            distributed.push({...coord, id: closest.id});
        }
    });
    return distributed;
};

const getLargestArea = (distributed, bounds) => {
    return Object.values(group(distributed))
        .filter(group => !touchesBounds(group, bounds))
        .reduce((prev, current) => (prev.length > current.length)
            ? prev
            : current
        );
};

const getSummedManhattanDistance = (coord, coords) => coords
    .reduce((dist, c2) => dist + manhattanDist(coord, c2), 0);

const findRegion = (coords, bounds, threshold) => {
    const region = [];
    loopBounds(bounds, (x, y) => {
        let coord = {x, y};
        const distance = getSummedManhattanDistance(coord, coords);
        if (distance < threshold) {
            region.push(coord);
        }
    });
    return region;
};

readCoords('input.txt').then(assignId).then(coords => {
    const bounds = getBounds(coords);

    console.log(`Part 1: largest area =  ${getLargestArea(assignPoint(coords, bounds), bounds).length}`);

    console.log(`Part 2: region size =  ${findRegion(coords, bounds, 10000).length}`);
});
