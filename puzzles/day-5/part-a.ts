import Day from '../../day.ts';

export type Range = {
  destinationStart: number;
  destinationEnd: number;
  sourceStart: number;
  sourceEnd: number;
  length: number;
  offset: number;
};

export type Conversion = {
  from: string;
  to: string;
  midPoint: number;
  ranges: Range[];
};

export type Conversions = Map<string, Conversion>;

export function getRange(
  sourceStart: number,
  offset: number,
  length: number,
): Range {
  const destinationStart = sourceStart + offset;

  return {
    destinationStart,
    destinationEnd: destinationStart + length - 1,
    sourceStart,
    sourceEnd: sourceStart + length - 1,
    offset: destinationStart - sourceStart,
    length,
  };
}

export function fillGaps(ranges: Range[]): Range[] {
  let min = 0;
  let max = Number.MAX_SAFE_INTEGER - 10;
  const gaps = ranges
    .sort((a, b) => a.sourceStart - b.sourceStart)
    .reduce((acc, a, i) => {
      if (min < a.sourceStart) {
        acc.push(getRange(min, 0, a.sourceStart - min));
      }

      if (i === ranges.length - 1 && max > a.sourceEnd) {
        acc.push(getRange(a.sourceEnd + 1, 0, max - a.sourceEnd));
      }
      min = a.sourceEnd + 1;
      return acc;
    }, [] as Range[]);

  return [...ranges, ...gaps].sort((a, b) => a.sourceStart - b.sourceStart);
}

export function parseRangeMap(map: string): Conversion {
  const [name, ...rawRanges] = map.trim().split('\n');

  const match = name.match(/([^-]+)-to-(\S+)\smap:/);

  let maxPoint = 0;
  let minPoint = Number.MAX_SAFE_INTEGER;

  const ranges = (rawRanges as string[]).map((range): Range => {
    const [destinationStart, sourceStart, length] = range
      .split(' ')
      .map((value) => parseInt(value));

    minPoint = Math.min(minPoint, sourceStart);
    maxPoint = Math.max(maxPoint, sourceStart + length - 1);

    return getRange(sourceStart, destinationStart - sourceStart, length);
  });

  return {
    from: match[1] as string,
    to: match[2] as string,
    ranges: fillGaps(ranges),
    midPoint: (maxPoint - minPoint) / 2,
  };
}

export function convert(sourceValue: number, ranges: Range[]) {
  const range = ranges.find(({ sourceStart, length }) => {
    return sourceValue >= sourceStart && sourceValue < sourceStart + length;
  });

  if (!range) return sourceValue;

  return sourceValue + range.offset;
}

export default class Day5A extends Day {
  constructor() {
    super({
      day: 5,
      challenge: 'A',

      sampleResult: '35',
    });
  }

  async answer(input: string) {
    const [seeds, ...maps] = input.trim().split('\n\n');

    const conversions: Conversions = new Map(
      maps.map((map) => {
        const range = parseRangeMap(map);
        return [range.from, range];
      }),
    );

    let type = 'seed';
    let values = seeds
      .replace('seeds:', '')
      .trim()
      .split(' ')
      .map((value) => parseInt(value));

    while (type !== 'location' && conversions.has(type)) {
      const conversion = conversions.get(type);

      values = values.map((value) => convert(value, conversion.ranges));
      type = conversion.to;
    }

    // Write your code here
    return Math.min(...values); // Return your result
  }
}
