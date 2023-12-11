import Day from '../../day.ts';
import { Quadtree, Rectangle } from '@timohausmann/quadtree-ts';

export function getRanges(line: number, start: number, length: number) {
  return new Rectangle({
    y: line - 1,
    x: start - 1,
    width: length + 2,
    height: 3,
  });
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

    const tree = new Quadtree<Rectangle<{ character: string }>>({
      width: maxLength,
      height: lines.length,
      maxObjects: 4,
    });

    const objects = [];

    lines.forEach((line, lineNumber) => {
      [...line.matchAll(/[^\d\.]/g)].forEach((value) => {
        const symbol = new Rectangle({
          width: 0.1,
          height: 0.1,
          x: value.index,
          y: lineNumber,
          data: { character: value[0] },
        });

        objects.push(symbol);
        tree.insert(symbol);
      });
    });

    let numbers = [];

    lines.forEach((line, lineNumber) => {
      let re = /\d+/g;
      let match;
      while ((match = re.exec(line)) != null) {
        const range = getRanges(lineNumber, match.index, match[0].length);

        const symbols = tree.retrieve(range);
        const hasSymbol = symbols.filter((rec) => {
          const { x, y, data } = rec;
          return (
            x >= range.x &&
            y >= range.y &&
            x < range.x + range.width &&
            y < range.y + range.height
          );
        });

        if (hasSymbol.length > 0) {
          numbers.push(parseInt(match[0]));
        }
      }
    });

    return numbers.reduce((a, b) => a + b);
  }
}
