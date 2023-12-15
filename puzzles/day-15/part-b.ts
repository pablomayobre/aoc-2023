import Day from '../../day.ts';
import { hashInstruction } from './part-a.ts';

export default class Day15B extends Day {
  constructor() {
    super({
      day: 15,
      challenge: 'B',

      sampleResult: "145",
    });
  }

  async answer(input: string) {
    const lenses: [string, number][][] = [];

    input.split(',').forEach((step) => {
      const [, label, operation, focalDistance] = [
        ...step.match(/([^\-\=]+)([\-\=])(\d*)/),
      ];

      const box = hashInstruction(label);

      const index = lenses[box]?.findIndex(([l]) => l === label);

      if (index !== -1 && index !== undefined) {
        if (operation === '-') lenses[box].splice(index, 1);
        if (operation === '=') lenses[box][index][1] = parseInt(focalDistance);
      } else {
        if (operation === '=') {
          lenses[box] ??= [];
          lenses[box].push([label, parseInt(focalDistance)]);
        }
      }
    });

    const result = lenses.reduce((acc, box, boxIndex) => {
      if (box) {
        return (
          acc +
          box.reduce(
            (acc, [, focalDistance], lensSlot) =>
              (boxIndex + 1) * (lensSlot + 1) * focalDistance + acc,
            0,
          )
        );
      }

      return acc;
    }, 0);

    return result;
  }
}
