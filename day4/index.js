const readLines = require('../index.js');


const parseEvent = event => {
    const re = /\[(.*)\] (.*)/;
    const match = re.exec(event);
    return {
        ts: match[1],
        desc: match[2]
    };
};

const readEvents = filename => readLines(filename, parseEvent)
    .then(events => events.sort((a, b) => a.ts.localeCompare(b.ts)));

const guardRe = /Guard #(\d*) begins shift/;

const findGuard = event => {
    const match = guardRe.exec(event);
    return Boolean(match) ? match[1] : null;
};

const getMinute = ts => parseInt(ts.split(' ')[1].split(':')[1], 10);

const fallsAsleep = desc => desc === 'falls asleep';


const objectMap = (o, mapFn) => Object.keys(o)
    .reduce((acc, key) => [...acc, mapFn(o[key], key)], []);

const getPairs = pattern => pattern.reduce((acc, e, i) => {
        const chunkIndex = Math.floor(i / 2);
        acc[chunkIndex] = acc[chunkIndex] || [];
        acc[chunkIndex].push(e);
        return acc;
    }, []);

const sleepingTime = pairs => pairs.reduce((sum, pair) => sum + pair[1].time - pair[0].time, 0);

const countNumDaysSleeping = (pairs, minute) =>
    pairs.reduce((numDays, pair) => (minute >= pair[0].time && minute < pair[1].time)
        ? numDays + 1
        : numDays,
    0);

const getAnswer = (minute, guardId) => minute * parseInt(guardId, 10);

const getGuards = events => events.reduce((acc, event) => {
    const newGuard = findGuard(event.desc);
    if (newGuard) {
        acc.currentGuard = newGuard || acc.currentGuard;
    } else {
        acc.guards[acc.currentGuard] = (acc.guards[acc.currentGuard] || []);
        acc.guards[acc.currentGuard].push({
            time: getMinute(event.ts),
            fallsAsleep: fallsAsleep(event.desc),
            ts: event.ts
        });
    }
    return acc;
}, {currentGuard: null, guards: {}}).guards;


const getMostSleepingGuard = guards => objectMap(guards, (times, id) => ({
        times: times,
        sleepingTime: sleepingTime(getPairs(times)),
        id: id
    }))
    .reduce((prev, current) => (prev.sleepingTime > current.sleepingTime)
        ? prev
        : current
    );

const getMostSleepingMinute = guard => {
    const pairs = getPairs(guard.times);

    return [...Array(60).keys()].map(minute => ({
        minute: minute,
        numDays: countNumDaysSleeping(pairs, minute)
    })).reduce((prev, current) => (prev.numDays > current.numDays)
        ? prev
        : current
    );
};

const getMostFrequentlySleepingGuard = guards => objectMap(guards, (times, id) => ({
        id: id,
        times: times
    }))
    .map(guard => ({...{id: guard.id}, ...getMostSleepingMinute(guard)}))
    .reduce((prev, current) => (prev.numDays > current.numDays)
        ? prev
        : current
    );

readEvents('input.txt').then(events => {
    const guards = getGuards(events);
    const mostSleepingGuard = getMostSleepingGuard(guards);

    const strat1 = getAnswer(getMostSleepingMinute(mostSleepingGuard).minute, mostSleepingGuard.id);
    console.log(`Strategy 1: ${strat1}`);

    const mostFrequentlySleepingGuard = getMostFrequentlySleepingGuard(guards);

    console.log(`Strategy 2: ${getAnswer(mostFrequentlySleepingGuard.minute, mostFrequentlySleepingGuard.id)}`);
});