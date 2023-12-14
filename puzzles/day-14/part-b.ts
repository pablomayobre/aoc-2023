import Day from '../../day.ts';
import { rotate90, Rock, rollRocks, getLoad, parseRocks } from './part-a.ts';

function getString(rocks: Rock[][]) {
  return rocks.map((rocks) => rocks.join('')).join('\n');
}

function spinCycle(rocks: Rock[][], rotations = 4) {
  let rotated = rocks;

  let prev = getString(rotated);
  const saved: string[] = [];

  for (let i = 1; i <= rotations; i++) {
    const index = saved.indexOf(prev);
    if (index !== -1) {
      const v = saved[index + ((rotations - i + 1) % (saved.length - index))];

      return rotate90(parseRocks(v), 'anticlockwise');
    } else {
      saved.push(prev);
      rotated = rotated.map((rocks) => rollRocks(rocks));
      prev = getString(rotated);
    }

    if (i !== rotations) {
      rotated = rotate90(rotated, 'anticlockwise');
    }
  }

  return rotated;
}

export default class Day14B extends Day {
  constructor() {
    super({
      day: 14,
      challenge: 'B',

      // The result of the algorithm using sample data
      sampleResult: '64',
    });
  }

  async answer(input: string) {
    // Write your code here
    const columns = rotate90(parseRocks(input));

    return spinCycle(columns, 1000000000 * 4)
      .map((rocks, _, arr) => getLoad(rocks, arr.length))
      .reduce((a, b) => a + b);
  }
}
