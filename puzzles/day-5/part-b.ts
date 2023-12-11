import Day from '../../day.ts';
import { getRange, parseRangeMap, Range } from './part-a.ts';

function isIntersecting(
  leftStart: number,
  leftEnd: number,
  rightStart: number,
  rightEnd: number,
) {
  const inside =
    (leftStart >= rightStart && leftStart <= rightEnd) ||
    (leftEnd <= rightEnd && leftEnd >= rightStart);
  const around = leftStart <= rightStart && leftEnd >= rightEnd;

  return inside || around;
}

function intersectRanges(sources: Range[], destinations: Range[]) {
  const ranges: Range[] = [];

  sources.forEach((source) => {
    destinations.forEach((destination) => {
      const intersect = isIntersecting(
        source.destinationStart,
        source.destinationEnd,
        destination.sourceStart,
        destination.sourceEnd,
      );

      if (intersect) {
        const start = Math.max(
          source.destinationStart,
          destination.sourceStart,
        );
        const end = Math.min(source.destinationEnd, destination.sourceEnd);

        ranges.push(
          getRange(
            start - source.offset,
            source.offset + destination.offset,
            end - start + 1,
          ),
        );
      }
    });
  });

  ranges.sort((a, b) => a.sourceStart - b.sourceStart);

  return ranges;
}

export default class Day5B extends Day {
  constructor() {
    super({
      day: 5,
      challenge: 'B',

      sampleResult: '46',
    });
  }

  async answer(input: string) {
    const [seeds, ...maps] = input.trim().split('\n\n');

    const conversions = new Map(
      maps.map((map) => {
        const range = parseRangeMap(map);

        return [range.to, range];
      }),
    );

    const newRange = conversions.get('location');
    let destination = newRange.ranges;
    let type = newRange.from;

    while (type !== 'seed') {
      const newRange = conversions.get(type);
      destination = intersectRanges(newRange.ranges, destination);
      type = newRange.from;
    }

    let minSeed = 0;
    let minLocation = Number.MAX_SAFE_INTEGER;

    seeds
      .replace('seeds:', '')
      .trim()
      .split(' ')
      .map((value) => parseInt(value))
      .forEach((start, index, array) => {
        if (index % 2 === 0) {
          const end = start + array[index + 1] - 1;

          destination.forEach((range) => {
            const intersect = isIntersecting(
              start,
              end,
              range.sourceStart,
              range.sourceEnd,
            );
            if (intersect) {
              const seed = Math.max(start, range.sourceStart);
              const location = seed + range.offset;

              if (location < minLocation) {
                minLocation = location;
                minSeed = seed;
              }
            }
          });
        }
      });

    return minLocation;
  }
}
