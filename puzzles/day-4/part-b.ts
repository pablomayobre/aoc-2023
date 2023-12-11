import Day from '../../day.ts';
import { getWinningNumbers, parseDay4Card } from './part-a.ts';

export default class Day4B extends Day {
  constructor() {
    super({
      day: 4,
      challenge: 'B',

      sampleResult: '30',
    });
  }

  async answer(input: string) {
    const cards = input
      .trim()
      .split('\n')
      .map((card) => parseDay4Card(card));

    const copies = new Map<number, number>(cards.map(({ card }) => [card, 1]));

    const wins = cards.map(({ card, winning, obtained }) => {
      const power = getWinningNumbers(winning, obtained).length;
      const add = copies.get(card) ?? 0;

      for (let i = 1; i <= power; i++) {
        const current = copies.get(card + i) ?? 0;
        copies.set(card + i, current + add);
      }

      return add;
    });

    return wins.reduce((a, b) => a + b);
  }
}
