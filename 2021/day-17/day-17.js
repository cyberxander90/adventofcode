const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const testInput = 'target area: x=20..30, y=-10..-5';

//--- Part One ---

// target area: x=20..30, y=-10..-5  =>  [20, 30, 10, 5]
function parse(input) {
  return input
    .match(/x=(-?\d+)..(-?\d+),\s+y=(-?\d+)..(-?\d+)/)
    .slice(1,5)
    .map(s => Math.abs(parseInt(s)));
}

// sum(1..n) = (n*(n+1)) / 2
// sum(m..n) = sum(1..n) - sum(1..m-1)
function getSum(m, n) {
  return m <= 1
    ? (n * (n+1)) / 2
    : getSum(1, n) - getSum(1, m-1);
}

// sum(m..n) = sum
// sum(m..n) = [(n*(n+1)) / 2] - [(m*(m-1)) / 2]
// => [(n*(n+1)) / 2] - [(m*(m-1)) / 2] = sum
// => clear and calculate n
function getN(m, sum) {
  return parseInt(Math.sqrt((((sum + getSum(1, m-1)) * 8) + 4) / 4) - 0.5);
}

function getStepsY(velocityY, y1, y2) {
  const m = Math.abs(velocityY);

  const result = [];
  let sum;
  let n = getN(m + (velocityY > 0 ? 1 : 0), y1);

  do {
    sum = getSum(m + (velocityY > 0 ? 1 : 0), n);
    if (sum >= y1 && sum <= y2) {
      result.push(n - m + 1 + (velocityY > 0 ? 2*m : 0));
    }
    n += 1;
  } while(sum <= y2);

  return result;
}

function getVelocitiesX(steps, x1, x2) {
  const result = [];
  let sum = getSum(1, steps);
  let n, currentSum;

  if (x1 < sum) {
    n = getN(1, x1);
    currentSum = getSum(1, n);
  } else {
    const intervals = parseInt((x1 - sum) / steps);
    n = steps + intervals;
    currentSum = sum + (intervals * steps);
  }

  do {
    if (currentSum >= x1 && currentSum <= x2) {
      result.push(n);
    }

    n += 1;
    if (currentSum >= sum) {
      currentSum += steps;
    } else {
      currentSum = getSum(1, n);
    }
  } while(currentSum <= x2);

  return result;
}

function getAllVelocities(x1, x2, y1, y2) {
  const result = new Set();

  for (let velocityY = y2 * -1; velocityY <= y2; velocityY++) {
    getStepsY(velocityY, y1, y2).forEach(steps => {
      getVelocitiesX(steps, x1, x2).forEach((x) => {
        result.add(`${x}:${velocityY}`);
      })
    })
  }

  return result;
}

function ex1(input) {
  const [x1, x2, y2, y1] = parse(input);
  let maxVelocityY =  Number.MIN_SAFE_INTEGER;

  getAllVelocities(x1, x2, Math.abs(y1), Math.abs(y2))
    .forEach(s => {
      const [_, velocityY] = s.split(':').map(n => parseInt(n));
      maxVelocityY = Math.max(maxVelocityY, velocityY);
    });

  return getSum(1, maxVelocityY);
}

console.log(ex1(testInput)); // 45
console.log(ex1(input)); // 4186

// --- Part Two ---

function ex2(input) {
  const [x1, x2, y2, y1] = parse(input);
  return getAllVelocities(x1, x2, Math.abs(y1), Math.abs(y2)).size;
}

console.log(ex2(testInput)); // 112
console.log(ex2(input));  // 2709
