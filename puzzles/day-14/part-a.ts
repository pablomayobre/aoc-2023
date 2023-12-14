import Day from '../../day.ts';

export type Rock = '#' | '.' | 'O';

export function parseRocks(input: string) {
  return input
    .trim()
    .split('\n')
    .map((str) => [...str.trim()] as Rock[]);
}

export function rotate90<T>(
  arr: T[][],
  dir: 'clockwise' | 'anticlockwise' = 'clockwise',
) {
  const transposed: T[][] = [];

  arr.forEach((a, x) => {
    x = dir === 'clockwise' ? x : arr.length - x - 1;
    a.forEach((v, y) => {
      y = dir === 'clockwise' ? a.length - y - 1 : y;
      transposed[y] ??= [];
      transposed[y][x] = v;
    });
  });

  return transposed;
}

export function rollRocks(rocks: Rock[]) {
  const newRocks: Rock[] = [];

  rocks.forEach((rock, index) => {
    if (rock === 'O') {
      newRocks.push('O');
      return;
    } else if (rock === '#') {
      while (newRocks.length < index) {
        newRocks.push('.');
      }
      newRocks.push('#');
    }
  });

  while (newRocks.length < rocks.length) {
    newRocks.push('.');
  }

  return newRocks;
}

export function getLoad(rocks: Rock[], rows: number) {
  return rocks.reduce((load, rock, index) => {
    return load + (rock === 'O' ? rows - index : 0);
  }, 0);
}

export default class Day14A extends Day {
  constructor() {
    super({
      day: 14,
      challenge: 'A',

      // The result of the algorithm using sample data
      sampleResult: '136',
    });
  }

  async answer(input: string) {
    // Write your code here
    const columns = rotate90(parseRocks(input));

    return columns
      .map((rocks) => rollRocks(rocks))
      .map((rocks, _, arr) => getLoad(rocks, arr.length))
      .reduce((a, b) => a + b);
  }
}
