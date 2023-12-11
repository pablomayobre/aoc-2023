import Day from '../../day.ts';

export type Symbol = {
  line: number;
  index: number;
  symbol: string;
  gear: number;
  gearCount: number;
};

export function newSymbol(line: number, index: number, symbol: string) {
  return {
    line,
    symbol,
    index,
    gear: 1,
    gearCount: 0,
  };
}

export function getStartAndEnd(value: RegExpMatchArray) {
  const endCharacter = value.index + value[0].length + 1;
  const startCharacter = value.index - 1;

  return [startCharacter, endCharacter];
}

export function splitPartsLines(input: string) {
  const lines = input
    .trim()
    .split('\n')
    .map((value) => value.trim());

  lines.push('', '', '');

  return lines;
}

export function getAllNumbers(lines: string[], lineNumber: number) {
  return [...lines[lineNumber - 1].matchAll(/\d+/g)];
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
    const lines = splitPartsLines(input);
    const symbols: Map<number, Symbol>[] = [];
    let count = 0;

    console.time();
    lines.forEach((line, lineNumber) => {
      const currentLine: Map<number, Symbol> = new Map();
      const symbolRegex = /[^\d\.]/g; // This is different for challenge A and B

      [...line.matchAll(symbolRegex)].forEach((value) => {
        currentLine.set(
          value.index,
          newSymbol(lineNumber, value.index, value[0]),
        );
      });

      symbols.push(currentLine);

      if (lineNumber > 0) {
        getAllNumbers(lines, lineNumber).forEach((value) => {
          const [startCharacter, endCharacter] = getStartAndEnd(value);

          for (let i = startCharacter; i < endCharacter; i++) {
            const found = symbols.find((map) => {
              if (map.has(i)) {
                count += parseInt(value[0]);
                return true;
              }
              return false;
            });
            if (found) break;
          }
        });
      }

      if (lineNumber > 1) {
        symbols.shift();
      }
    });

    return count;
  }
}
