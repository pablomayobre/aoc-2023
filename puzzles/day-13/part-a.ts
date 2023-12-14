import Day from '../../day.ts';

export type Pattern = {
  rows: string[][];
  columns: string[][];
};

function getSimilarity (a: string[], b: string[], smudge = 0) {
  let diff = 0;

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      diff++
    }

    if (diff > smudge) {
      return diff
    }
  }

  return diff;
}

function findEqualityPattern(lines: string[][], smudge = 0) {
  for (let i=0; i < lines.length - 1; i++) {
    let similarity = 0
    for (let j = 0; j < lines.length; j++) {
      const left = i - j
      const right = i + j + 1;

      if (left >= 0 && right < lines.length) {
        similarity += getSimilarity(lines[left], lines[right], smudge - similarity)
        if (similarity > smudge) {
          break;
        }
      }

      if (right >= lines.length && left < 0) {
        break;
      }
    }

    if (similarity === smudge) {
      return i + 1
    }
  }

  return 0
}

export function findMirror({ columns, rows }: Pattern, smudge = 0) {
  const r = findEqualityPattern(rows, smudge);
  const c = findEqualityPattern(columns, smudge);

  return r * 100 + c;
}

export function parseMirrorPatterns(input: string): Pattern[] {
  return input
      .trim()
      .split('\n\n')
      .map((pattern) => {
        const columns: string[][] = [];

        const rows = pattern.trim().split('\n').map((value) => {
          const row = [...value]
          row.forEach((char, index) => {
            columns[index] ??= [];
            columns[index].push(char);
          });

          return row
        });

        return {
          rows,
          columns,
        };
      });
}

export default class Day13A extends Day {
  constructor() {
    super({
      day: 13,
      challenge: 'A',

      sampleResult: '405',
    });
  }

  async answer(input: string) {
    const patterns = parseMirrorPatterns(input)

    return patterns
      .map((pattern) => findMirror(pattern))
      .reduce((a, b) => a + b);
  }
}
