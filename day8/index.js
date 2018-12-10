const readLines = require('../index.js');

const parseTree = data => data[0].split(' ').map(i => parseInt(i, 10));


const readNode = tree => {
    if (tree.length === 0) {
        return null;
    }
    const numChildren = tree.shift();
    const numMetadata = tree.shift();
    return {
        children: [...Array(numChildren).keys()].map(i => readNode(tree)),
        metadata: [...Array(numMetadata).keys()].map(i => tree.shift())
    };
};

const getMetadata = nodes => nodes
    .reduce((acc, node) => [...acc, ...node.metadata, ...getMetadata(node.children)], []);

const sum = arr => arr.reduce((sum, el) => sum + el, 0);

const getChild = (node, idx) => node.children[idx]
    ? node.children[idx]
    : {metadata: [], children: []};

const getNodeValue = node => node.children.length
    ? node.metadata.reduce((acc, i) => acc + getNodeValue(getChild(node, i - 1)), 0)
    : sum(node.metadata);

readLines('input.txt', d => d).then(parseTree).then(tree => {

    const root = readNode(tree);

    console.log(`Part 1: Sum Metadata = ${sum(getMetadata([root]))}`);
    console.log(`Part 2: Root value = ${getNodeValue(root)}`);
});
