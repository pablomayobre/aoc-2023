import Day from '../../day.ts';

export type Galaxy = {
  id: number;
  row: number;
  col: number;
};

export function reverseSet(set: Set<number>, max: number) {
  const newSet = new Set<number>();

  for (let i = 0; i < max; i++) {
    if (!set.has(i)) newSet.add(i);
  }

  return newSet;
}

export function getShortestDistance(a: number, b: number, empty: Set<number>, expansion: number) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  let offset = 0;

  for (let i = min; i < max; i++) {
    if (empty.has(i)) {
      offset += (expansion - 1);
    }
  }

  return max - min + offset;
}

export function getAllDistances(
  galaxies: Map<number, Galaxy>,
  emptyRows: Set<number>,
  emptyCols: Set<number>,
  expansion: number
) {
  const distances: number[] = [];

  [...galaxies.values()].forEach((a, index, galaxies) => {
    for (let i = index + 1; i < galaxies.length; i++) {
      const b = galaxies[i];

      const horizontal = getShortestDistance(a.col, b.col, emptyCols, expansion);
      const vertical = getShortestDistance(a.row, b.row, emptyRows, expansion);

      distances.push(horizontal + vertical);
    }
  });

  return distances
}

export function parseGalaxies (input: string) {
  const lines = input.trim().split('\n');

  const nonEmptyColumns = new Set<number>();
  const nonEmptyRows = new Set<number>();

  let id = 0;

  let maxCols = 0;

  const galaxies = new Map(
    lines.flatMap((line, row) => {
      maxCols = Math.max(line.length, maxCols);

      return [...line.matchAll(/\#/g)].map((match) => {
        nonEmptyRows.add(row);
        nonEmptyColumns.add(match.index);

        id++;

        return [
          id,
          {
            id,
            row,
            col: match.index,
          },
        ] as const;
      });
    }),
  );

  return {
    galaxies,
    emptyCols: reverseSet(nonEmptyColumns, maxCols),
    emptyRows: reverseSet(nonEmptyRows, lines.length)
  }
}

export default class Day11A extends Day {
  constructor() {
    super({
      day: 11,
      challenge: 'A',

      sampleResult: '374',
    });
  }

  async answer(input: string) {
    const {galaxies, emptyRows, emptyCols} = parseGalaxies(input)

    const distances = getAllDistances(
      galaxies,
      emptyRows,
      emptyCols,
      2
    );

    return distances.reduce((a, b) => a+b);
  }
}
