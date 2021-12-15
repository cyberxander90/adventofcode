const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const testInput =
`1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

//--- Part One ---

function Graph(input) {
  const encodeNode = (i,j) => `${i},${j}`;
  const decodeNode = (node) => node.split(',').map(n => parseInt(n));

  const nodes = [];
  const matrix = input.trim()
    .split('\n')
    .map((line, i) => line.trim()
      .split('')
      .map((n, j) => {
        nodes.push(encodeNode(i,j));
        return parseInt(n);
      })
    );

  this.nodes = () => nodes;
  this.adj = (node) => {
    const [i,j] = decodeNode(node);
    return [
      [i+1, j],
      [i-1, j],
      [i, j+1],
      [i, j-1]
    ].filter(([i,j]) => i >= 0 && j >= 0 && i < matrix.length && j < matrix[0].length)
      .map(([i,j]) => encodeNode(i,j));
  };
  this.weight = (node) => {
    const [i,j] = decodeNode(node);
    return matrix[i][j];
  }
}

function PriorityQueue(compare) {
  const queue = [];

  this.count = () => queue.length;
  this.dequeue = () => queue.shift();
  this.enqueue = (item) => {
    queue.push(item);
    queue.sort(compare);
  }
}

function dijkstra(graph, initialNode) {
  const distances = {};
  const parents = {};
  const visited = {};
  const priorityQueue = new PriorityQueue((a, b) => a.distance - b.distance);

  graph.nodes().forEach(node => {
    distances[node] = Number.MAX_SAFE_INTEGER;
    parents[node] = null;
    visited[node] = false;
  });

  distances[initialNode] = 0;
  priorityQueue.enqueue({ node: initialNode, distance: 0 });

  while(priorityQueue.count() > 0) {
    const { node: currentNode } = priorityQueue.dequeue();
    visited[currentNode] = true;

    graph.adj(currentNode).forEach(nextNode => {
      const nextNodeDistance = distances[currentNode] + graph.weight(nextNode);
      if (visited[nextNode] || distances[nextNode] <= nextNodeDistance) {
        return;
      }

      distances[nextNode] = nextNodeDistance;
      parents[nextNode] = currentNode;
      priorityQueue.enqueue({ node: nextNode, distance: nextNodeDistance });
    })
  }

  return { distances, parents };
}

function ex1(input) {
  const graph = new Graph(input);
  const { 0: first, length, [length -1]: last } = graph.nodes();

  return dijkstra(graph, first).distances[last];
}

console.log(ex1(testInput));
console.log(ex1(input));

// --- Part Two ---

function scaleInput(input) {
  const m = input.trim()
    .split('\n')
    .map((line, i) => line.trim()
      .split('')
      .map((n, j) => parseInt(n))
    );
  const width = m[0].length;
  const height = m.length;

  const result = new Array(height * 5);
  for(let i = 0; i < result.length; i++) {
    result[i] = new Array(width * 5);
  }

  for (let i = 0; i < height * 5; i++) {
    for(let j = 0; j < width; j++) {
      if (i < height) {
        result[i][j] = m[i][j];
      } else {
        let value = result[i-height][j] + 1;
        if (value === 10) {
          value = 1;
        }
        result[i][j] = value;
      }
    }
  }

  for (let i = 0; i < height * 5; i++) {
    for(let j = width; j < width * 5; j++) {
      let value = result[i][j-width] + 1;
      if (value === 10) {
        value = 1;
      }
      result[i][j] = value;
    }
  }

  return result.map(l => l.join('')).join('\n');
}

function ex2(input) {
  return ex1(scaleInput(input))
}

console.log(ex2(testInput));
console.log(ex2(input));
