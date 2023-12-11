import Day from '../../day.ts';
import { getRanges, symbolsInRange } from './part-a.ts';

export default class Day3B extends Day {
  constructor() {
    super({
      day: 3,
      challenge: 'B',

      sampleResult: '467835',
    });
  }

  async answer(input: string) {
    const lines = input
      .trim()
      .split('\n')
      .map((value) => value.trim());

    const maxLength = Math.max(...lines.map((value) => value.length));

    const symbolPositions = lines
      .flatMap((line, lineNumber) => {
        return [...line].map((value, index) =>
          /\*/.test(value) ? index + lineNumber * maxLength : null,
        );
      })
      .filter((value) => value !== null);

    let gears = new Map<number, number[]>();

    lines.forEach((line, lineNumber) => {
      let re = /\d+/g;
      let match;
      while ((match = re.exec(line)) != null) {
        const ranges = getRanges(
          maxLength,
          lineNumber,
          match.index,
          match[0].length,
        );

        const symbols = ranges
          .flatMap((range) => {
            return symbolsInRange(symbolPositions, ...range);
          })
          .forEach((symbol) => {
            const gear = gears.get(symbol) ?? [];

            gear.push(parseInt(match[0]));

            gears.set(symbol, gear);
          });
      }
    });

    return [...gears.values()]
      .map((values) =>
        values.length > 1 ? values.reduce((prev, curr) => prev * curr, 1) : 0,
      )
      .reduce((a, b) => a + b); // Return your result
  }
}
