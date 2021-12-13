const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const testInput =
`6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

//--- Part One ---

function parseInstructions(input) {
  const coordinates = [];
  const folds = [];

  let isParsingCoordinates = true;
  const parseCoordinates = line => line.split(',').map(n => parseInt(n));
  const parseFolds = line => line.split(' ')[2].split('=').map((n,i) => i === 0 ? n : parseInt(n));

  input.trim()
    .split('\n')
    .map(line => line.trim())
    .forEach(line => {
      if (line.length === 0) {
        isParsingCoordinates = false;
        return;
      }

      isParsingCoordinates
        ? coordinates.push(parseCoordinates(line))
        : folds.push(parseFolds(line));
    });

  return { coordinates, folds };
}

function getBoard() {
  const coordsX = {};
  const coordsY = {};

  const addCoord = (x,y) => {
    const addCoordTo = (coords, a, b) => {
      if (!coords[a]) {
        coords[a] = new Set();
      }
      coords[a].add(b);
    };

    addCoordTo(coordsX, x, y);
    addCoordTo(coordsY, y, x);
  };

  const removeCoord = (x,y) => {
    coordsX[x].delete(y);
    coordsY[y].delete(x);
  }

  const fold = (coords, foldA, buildCoord) => {
    Object.keys(coords)
      .map(a => parseInt(a))
      .forEach(a => {
        if (a <= foldA) {
          return;
        }

        Array.from(coords[a]).forEach(b => {
          addCoord(...buildCoord(a - (2 * (a-foldA)), b));
          removeCoord(...buildCoord(a, b));
        });
      });
  }
  const foldOnX = (foldX) => fold(coordsX, foldX, (a,b) => [a,b]);
  const foldOnY = (foldY) => fold(coordsY, foldY, (a,b) => [b,a]);
  const foldOn = (axis, value) => (axis === 'x' ? foldOnX : foldOnY)(value);

  const all = () => Object.keys(coordsX)
    .map(a => parseInt(a))
    .map(x => Array.from(coordsX[x]).map(y => [x,y]))
    .flat();

  const toStr = () => {
    let [maxX, maxY] = [0, 0];
    all().forEach(([x,y]) => {
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
    });

    const result = [];
    for(let j = 0; j <= maxY; j++) {
      const line = [];
      for(let i = 0; i <= maxX; i++) {
        const exist = coordsX[i] && coordsX[i].has(j);
        line.push(exist ? '#' : ' ');
      }
      result.push(line.join(''));
    }
    return result.join('\n');
  }

  return {
    coordsX,
    coordsY,
    addCoord,
    removeCoord,
    foldOn,
    all,
    toStr,
  };
}

function ex1(input) {
  const board = getBoard();
  const { coordinates, folds } = parseInstructions(input);

  coordinates.forEach(([x,y]) => board.addCoord(x,y));
  board.foldOn(folds[0][0], folds[0][1]);

  return board.all().length;
}

console.log(ex1(testInput));
console.log(ex1(input));

// --- Part Two ---

function ex2(input) {
  const board = getBoard();
  const { coordinates, folds } = parseInstructions(input);

  coordinates.forEach(([x,y]) => board.addCoord(x,y));
  folds.forEach(([axis, value]) => board.foldOn(axis, value));

  return board.toStr();
}

console.log(ex2(testInput));
console.log(ex2(input));
