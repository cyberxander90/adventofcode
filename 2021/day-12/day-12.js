const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const testInput =
`fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

//--- Part One ---

function getGraph(input) {
  return input.trim()
    .split('\n')
    .reduce((nodes, line) => {
      const [a,b] = line.trim().split('-');
      nodes[a] = (nodes[a] || []).concat([b]);
      nodes[b] = (nodes[b] || []).concat([a]);
      return nodes;
    }, {});
}

function countPath(graph, currentNode, visited = []) {
  if (currentNode == 'end') {
    return 1
  }

  return graph[currentNode].reduce((acc, nextNode) => {
    if (visited.includes(nextNode)) {
      return acc + 0
    }

    const nextVisited = currentNode == currentNode.toUpperCase()
      ? [...visited]
      : [...visited, currentNode];
    return acc + countPath(graph, nextNode, nextVisited);
  }, 0)
}

function ex1(input) {
  const graph = getGraph(input)
  return countPath(graph, 'start');
}

// console.log(ex1(testInput));
// console.log(ex1(input));

// --- Part Two ---

function countPath2(graph, currentNode, remainingVisits, chain = []) {
  if (currentNode == 'end') {
    return [[...chain, 'end'].join('')];
  }

  return graph[currentNode]
    .map(nextNode => {
      if (nextNode in remainingVisits && remainingVisits[nextNode] <= 0) {
        return [];
      }

      const nextRemainingVisited = currentNode in remainingVisits
        ? { ...remainingVisits, [currentNode]: remainingVisits[currentNode]-1 }
        : { ...remainingVisits };
      return countPath2(graph, nextNode, nextRemainingVisited, [...chain, currentNode]);
    })
    .flat();
}

function ex2(input) {
  const graph = getGraph(input);
  const commonNodes = Object.keys(graph)
    .filter(node => node != 'start' && node != 'end' && node == node.toLowerCase());
  const values = commonNodes.map(node => {
    const remainingVisits = commonNodes.concat(['start', 'end']).reduce((acc, node) => {
      acc[node] = 1;
      return acc;
    }, {});
    remainingVisits[node] += 1;
    return countPath2(graph, 'start', remainingVisits);
  }).flat();
  return [...new Set(values)].length;
}

console.log(ex2(testInput));
console.log(ex2(input));
