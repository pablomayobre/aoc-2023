import Day from '../../day.ts';

export function symbolsInRange(symbols: number[], start: number, end: number) {
  return symbols.filter((number) => number >= start && number <= end);
}

export function getRanges(
  maxLineLength: number,
  line: number,
  start: number,
  length: number,
) {
  const ranges: (readonly [number, number])[] = [];
  const min = Math.max(start - 1, 0);
  const max = Math.min(start + length, maxLineLength);

  if (line > 1) {
    const offset = (line - 1) * maxLineLength;
    ranges.push([offset + min, offset + max] as const);
  }
  {
    const offset = line * maxLineLength;
    ranges.push([offset + min, offset + max] as const);
  }

  {
    const offset = (line + 1) * maxLineLength;
    ranges.push([offset + min, offset + max] as const);
  }

  return ranges;
}

export default class Day3A extends Day {
  constructor() {
    super({
      day: 3,
      challenge: 'A',

      sampleResult: '4361',
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
          /[^\d\.]/.test(value) ? index + lineNumber * maxLength : null,
        );
      })
      .filter((value) => value !== null);

    let numbers = [];

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

        const hasSymbol = ranges.find((range) => {
          return symbolsInRange(symbolPositions, ...range).length > 0;
        });

        if (hasSymbol) numbers.push(parseInt(match[0]));
      }
    });

    // Write your code here
    return numbers.reduce((a, b) => a + b); // Return your result
  }
}
