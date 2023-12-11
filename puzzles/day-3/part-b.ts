import Day from '../../day.ts';
import {
  getAllNumbers,
  getStartAndEnd,
  newSymbol,
  splitPartsLines,
  Symbol,
} from './part-a.ts';

export default class Day3B extends Day {
  constructor() {
    super({
      day: 3,
      challenge: 'B',

      sampleResult: '467835',
    });
  }

  async answer(input: string) {
    const lines = splitPartsLines(input);
    const symbols: Map<number, Symbol>[] = [];
    let gear = 0;

    lines.forEach((line, lineNumber) => {
      const currentLine: Map<number, Symbol> = new Map();
      const symbolRegex = /\*/g; // This is different for challenge A and B

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
            symbols.forEach((map) => {
              const symbol = map.get(i);
              if (symbol) {
                symbol.gearCount++;
                symbol.gear *= parseInt(value[0]);
              }
            });
          }
        });
      }

      if (lineNumber > 1) {
        const done = symbols.shift();
        gear += Array.from(done.values()).reduce(
          (prev, symbol) => prev + (symbol.gearCount <= 1 ? 0 : symbol.gear),
          0,
        );
      }
    });

    return gear;
  }
}
