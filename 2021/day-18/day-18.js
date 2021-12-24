const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const testInput = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`;

//--- Part One ---

const LEFT = 'left';
const RIGHT = 'right';

function Node({ left, right, parent, value }) {
  this.left = left;
  this.right = right;
  this.parent = parent;
  this.value = value;

  this.deep = () => this.parent ? 1 + this.parent.deep() : 0;

  this.findLeaveTo = (direction) => {
    const inverseDirection = direction === LEFT ? 'right' : 'left';

    // going up
    let currentNode = this;
    while (currentNode.parent && currentNode.parent[direction] == currentNode) {
      currentNode = currentNode.parent;
    }
    if (!currentNode.parent) {
      return null;
    }

    // going down
    currentNode = currentNode.parent[direction];
    while(currentNode && currentNode[inverseDirection]) {
      currentNode = currentNode[inverseDirection];
    }

    return currentNode;
  };

  this.explode = () => {
    this.value = 0;
    this.left = null;
    this.right = null;
  };

  this.split = () => {
    const splittedValue1 = parseInt(this.value / 2);
    const splittedValue2 = splittedValue1 + (this.value % 2 > 0 ? 1 : 0);

    this.value = undefined;
    this.left = new Node({ value: splittedValue1, parent: this });
    this.right = new Node({ value: splittedValue2, parent: this });
  };

  this.magnitude = () => this.value != undefined
    ? this.value
    : (3*this.left.magnitude()) + (2*this.right.magnitude());

  this.toString = () => this.value == undefined
    ? `[${this.left.toString()},${this.right.toString()}]`
    : `${this.value}`;
}

function Tree({ root, leaves }) {
  this.root = root;
  this.leaves = leaves;

  this.add = otherTree => {
    const newTree = new Tree({
      leaves: this.leaves.concat(otherTree.leaves),
      root: new Node({
        left: this.root,
        right: otherTree.root
      }),
    });
    this.root.parent = newTree.root;
    otherTree.root.parent = newTree.root;

    return newTree.reduce();
  };

  const removeLeave = leave => {
    const index = this.leaves.indexOf(leave);
    this.leaves.splice(index, 1);
    return index;
  };

  const explode = () => {
    const leaveAtDeep5 = this.leaves.find(leave => leave.deep() >= 5);
    if (!leaveAtDeep5) {
      return;
    }

    const nodeToExplode = leaveAtDeep5.parent;
    let index;
    [LEFT, RIGHT].forEach(direction => {
      const leaveOnDirection = nodeToExplode.findLeaveTo(direction);
      if (leaveOnDirection) {
        leaveOnDirection.value += nodeToExplode[direction].value;
      }
      index = removeLeave(nodeToExplode[direction]);
    });
    nodeToExplode.explode();
    this.leaves.splice(index, 0, nodeToExplode);

    this.reduce();
  }

  const split = () => {
    const leaveToSplit = this.leaves.find(leave => leave.value >= 10);
    if (!leaveToSplit) {
      return;
    }

    leaveToSplit.split();
    const index = removeLeave(leaveToSplit);
    this.leaves.splice(index, 0, leaveToSplit.right);
    this.leaves.splice(index, 0, leaveToSplit.left);

    this.reduce();
  }

  this.reduce = () => {
    explode();
    split();

    return this;
  }

  this.toString = () => root.toString();
}

Tree.parse = input => {
  const leaves = [];
  const parseInputNode = (i = 0, parent = null) => {
    const node = new Node({ parent });

    if (!isNaN(input[i])) {
      node.value = parseInt(input[i]);
      leaves.push(node);
    } else {
      let leftNode, rightNode;
      [i, leftNode] = parseInputNode(i+1, node);
      [i, rightNode] = parseInputNode(i+1, node);
      node.left = leftNode;
      node.right = rightNode;
    }

    return [i+1, node];
  }
  const [_, root] = parseInputNode();

  return new Tree({ root, leaves });
}

function ex1(input) {
  return input.trim().split('\n').reduce((acc, line) => {
    const tree = Tree.parse(line.trim());
    if (!acc) {
      return tree;
    }

    const result = acc.add(tree);
    // console.log(result.toString());
    return result;
  }, null).root.magnitude();
}

console.log(ex1(testInput));
console.log(ex1(input));

// --- Part Two ---

function ex2(input) {
  const lines = input.trim().split('\n').map(l => l.trim());
  let maxMag = -1;
  let maxMagTrees;

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i == j) {
        continue;
      }

      const addedTree = Tree.parse(lines[i]).add(Tree.parse(lines[j]));
      const currentMag = addedTree.root.magnitude();
      if (currentMag > maxMag) {
        maxMag = currentMag;
        maxMagTrees = [i, j, addedTree.toString()];
      }
    }
  }

  // console.log(maxMagTrees);
  return maxMag;
}

console.log(ex2(testInput));
console.log(ex2(input));
