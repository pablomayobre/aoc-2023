import Day from '../../day.ts';

let cacheHits = 0;
let cacheMiss = 0;

function minimumLength(damaged: number[]) {
  return damaged.reduce((acc, damaged) => damaged + 1 + acc, 0);
}

function getMatchString(
  prev: string,
  i: number,
  search: number,
  fill?: number,
) {
  const str = `${prev}${'.'.repeat(i)}${'#'.repeat(search)}`;
  return fill ? `${str}${'.'.repeat(fill - i - search)}` : str;
}

function searchInRange<T extends any>(
  array: T[],
  search: T,
  length: number,
  index: number = 1,
) {
  for (let i = 0; i < length; i++) {
    if (array[i + index] === search) return true;
  }

  return false;
}

export function printCacheRatio() {
  console.log(cacheHits / (cacheMiss + cacheHits));
}

export function canMatchCount(
  springs: string[],
  damaged: number[],
  memory?: Map<`${string} ${string}`, number>,
  matchString = '',
) {
  let count = 0;

  memory = memory ?? new Map();

  const memo = memory.get(`${springs.join('')} ${damaged.join(',')}`);
  if (memo) {
    cacheHits++;
    return [memo, memory] as const;
  } else cacheMiss++;

  const [search, ...nextDamaged] = damaged;
  const max = springs.length - minimumLength(nextDamaged) - search + 1;

  for (let i = 0; i < max; i++) {
    if (springs[i - 1] === '#') break;

    if (searchInRange(springs, '.', search, i) || springs[i + search] === '#')
      continue;

    if (damaged.length === 1) {
      if (springs.includes('#', i + search)) continue;
      // getMatchString(matchString, i, search, springs.length)
      count++;
    } else {
      count += canMatchCount(
        springs.slice(i + search + 1),
        nextDamaged,
        memory,
        '', //getMatchString(matchString, i, search),
      )[0];
    }
  }

  memory.set(`${springs.join('')} ${damaged.join(',')}`, count);

  return [count, memory] as const;
}

export default class Day12A extends Day {
  constructor() {
    super({
      day: 12,
      challenge: 'A',

      sampleResult: 21,
    });
  }

  async answer(input: string) {
    // Write your code here

    const start = input
      .trim()
      .split('\n')
      .map((line) => {
        const [springs, nums] = line.split(' ');

        return {
          springs: [...springs],
          damaged: nums.split(',').map((value) => parseInt(value)),
        };
      });

    const mem = new Map<`${string} ${string}`, number>();

    const counts = start.map(({ springs, damaged }) => {
      const [count, memory] = canMatchCount(springs, damaged, mem);

      return { count, springs, damaged };
    });

    printCacheRatio();

    // Return your result
    return counts.reduce((a, b) => a + b.count, 0);
  }
}
