const fs = require('fs');
const path = require('path');

const input : string = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const testInput =
`..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###
.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.
.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....
.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..
...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....
..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;

//--- Part One ---

type Bit = 0 | 1;
type Input = { imageEnhancement: Bit[], image: Bit[][], infinite: Bit };

function parse(input: string): Input {
  const result: Input = {
    imageEnhancement: [],
    image: [],
    infinite: 0
  };

  let isParsingImage = false;
  input.trim().split('\n')
    .map(l => l.trim())
    .forEach(l => {
      if (l.length === 0) {
        isParsingImage = true;
        return;
      }

      const bits = l.split('').map(c => c === '.' ? 0 : 1);
      if (isParsingImage) {
        result.image.push(bits);
      } else {
        result.imageEnhancement.push(...bits)
      }
    });

  return result;
}

function binaryToDecimal(binary: Bit[]): number {
  return binary.length == 1
    ? binary[0]
    : binary[0] * (2 ** (binary.length - 1)) + binaryToDecimal(binary.slice(1))
}

function grow(input: Input) {
  const generateBits = () => Array(input.image[0].length).fill(input.infinite);

  input.image.splice(0, 0, generateBits());
  input.image.push(generateBits());

  for (const bits of input.image) {
    bits.splice(0, 0, input.infinite);
    bits.push(input.infinite);
  }
}

function squareIndexes(i: number, j: number): number[][] {
  return [
    [i-1, j-1],
    [i-1, j],
    [i-1, j+1],
    [i, j-1],
    [i, j],
    [i, j+1],
    [i+1, j-1],
    [i+1, j],
    [i+1, j+1],
  ];
}

function processImage(input: Input, times = 1) {
  while (times > 0) {
    grow(input);
    const newImage: Bit[][] = [];

    for (let i = 0; i < input.image.length; i++) {
      newImage.push([]);

      for (let j = 0; j < input.image[i].length; j++) {
        const binary : Bit[] = squareIndexes(i,j)
          .map(([i2, j2]) => input.image[i2]?.[j2])
          .map(bit => bit === undefined ? input.infinite : bit);
        const number = binaryToDecimal(binary);
        const bit = input.imageEnhancement[number];

        newImage[i].push(bit);
      }
    }

    input.infinite = input.imageEnhancement[input.infinite === 0 ? 0 : input.imageEnhancement.length -1];
    input.image = newImage;
    times -= 1;
  }
}

function ex1(inp: string) {
  const input = parse(inp);
  processImage(input, 2);
  return input.image.reduce((acc, bits) => acc + bits.filter(b => b === 1).length, 0);
}

console.log(ex1(testInput));
console.log(ex1(input));

// --- Part Two ---

function ex2(inp: string) {
  const input = parse(inp);
  processImage(input, 50);
  return input.image.reduce((acc, bits) => acc + bits.filter(b => b === 1).length, 0);
}

console.log(ex2(testInput));
console.log(ex2(input));
