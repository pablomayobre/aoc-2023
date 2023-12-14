import Day from '../../day.ts';
import { canMatchCount, printCacheRatio } from './part-a.ts';

export default class Day12B extends Day {
  constructor() {
    super({
      day: 12,
      challenge: 'B',

      // The result of the algorithm using sample data
      sampleResult: '525152',
    });
  }

  async answer(input: string) {
    const start = input
      .trim()
      .split('\n')
      .map((line) => {
        let [springs, nums] = line.split(' ');

        return {
          springs: [...(springs + '?').repeat(5)].slice(0, -1),
          damaged: (nums + ',')
            .repeat(5)
            .split(',')
            .filter((value) => value.trim() !== '')
            .map((value) => parseInt(value)),
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
