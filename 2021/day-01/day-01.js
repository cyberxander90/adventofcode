const fs = require('fs');
const path = require('path');

const depths = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8')
  .split('\n')
  .map(line => parseInt(line.trim()));

const test = [
  199,
  200,
  208,
  210,
  200,
  207,
  240,
  269,
  260,
  263,
];

//--- Part One ---

const ex1 = depths => {
  let result = 0;
  let prevDepth;

  depths.forEach(depth => {
    if (prevDepth !== undefined && depth > prevDepth) {
      result += 1;
    }
    prevDepth = depth;
  });

  return result;
}

console.log(ex1(test))
console.log(ex1(depths));

// --- Part Two ---

const ex2 = depths => {
  const windowDepths = depths.map((depth, i) => depth + (depths[i+1] || 0) + (depths[i+2] || 0))

  return ex1(windowDepths);
}

console.log(ex2(test))
console.log(ex2(depths));
