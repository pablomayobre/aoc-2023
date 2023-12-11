import Day from '../../day.ts';
import { getRanges } from './part-a.ts';
import { Quadtree, Rectangle } from '@timohausmann/quadtree-ts';

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

    let gears = new Map<string, number[]>();

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

        hasSymbol.forEach((symbol) => {
          const identifier = `${symbol.data.character}.${symbol.x}-${symbol.y}`;
          const gear = gears.get(identifier) ?? [];

          gear.push(parseInt(match[0]));

          gears.set(identifier, gear);
        });
      }
    });

    return [...gears.values()]
      .map((values) =>
        values.length > 1 ? values.reduce((prev, curr) => prev * curr, 1) : 0,
      )
      .reduce((a, b) => a + b);
  }
}
