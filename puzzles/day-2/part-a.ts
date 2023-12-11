import Day from '../../day.ts';

export function parseDay2Input(input: string) {
  const match = input.match(/Game (\d+): (.+)/);

  const sets = match[2].split(';').map((set) => {
    return new Map(
      set.split(',').map((value) => {
        const [number, color] = value.trim().split(' ');

        return [color, parseInt(number)];
      }),
    );
  });

  return {
    game: parseInt(match[1]),
    sets,
  };
}

export default class Day2A extends Day {
  constructor() {
    super({
      day: 2,
      challenge: 'A',

      sampleResult: '8',
    });
  }

  async answer(input: string) {
    const games = input
      .trim()
      .split('\n')
      .map((input) => parseDay2Input(input));

    const value = games
      .filter((game) => {
        return !game.sets.find((cubes) => {
          const red = cubes.get('red') ?? 0;
          if (red > 12) return true;

          const green = cubes.get('green') ?? 0;
          if (green > 13) return true;

          const blue = cubes.get('blue') ?? 0;
          if (blue > 14) return true;

          return false;
        });
      })
      .reduce((prev, curr) => prev + curr.game, 0);

    return value;
  }
}
