import Day from '../../day.ts';
import { parseDay2Input } from './part-a.ts';

export default class Day2B extends Day {
  constructor() {
    super({
      day: 2,
      challenge: 'B',

      sampleResult: '2286',
    });
  }

  async answer(input: string) {
    const games = input
      .trim()
      .split('\n')
      .map((input) => parseDay2Input(input));

    const value = games
      .map((game) => {
        let red = 0,
          green = 0,
          blue = 0;

        for (const set of game.sets) {
          red = Math.max(red, set.get('red') ?? 0);
          green = Math.max(green, set.get('green') ?? 0);
          blue = Math.max(blue, set.get('blue') ?? 0);
        }

        return red * green * blue;
      })
      .reduce((a, b) => a + b);

    return value; // Return your result
  }
}
