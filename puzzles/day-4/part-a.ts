import Day from '../../day.ts';

export function parseDay4Card(card: string) {
  const match = card.match(/Card\s+(\d+): (.+)/);

  const [winning, obtained] = match[2].split('|').map((set) => {
    return set
      .split(' ')
      .filter((value) => value !== '')
      .map((value) => parseInt(value));
  }) as [number[], number[]];

  return {
    card: parseInt(match[1]),
    winning,
    obtained,
  };
}

export function getWinningNumbers(winning: number[], obtained: number[]) {
  const nums = new Set(obtained);

  return winning.filter((num) => nums.has(num));
}

export default class Day4A extends Day {
  constructor() {
    super({
      day: 4,
      challenge: 'A',

      sampleResult: '13',
    });
  }

  async answer(input: string) {
    const cards = input
      .trim()
      .split('\n')
      .map((card) => parseDay4Card(card));

    const wins = cards.map(({ winning, obtained }) => {
      const power = getWinningNumbers(winning, obtained).length - 1;

      if (power < 0) return 0;

      return 2 ** power;
    });

    return wins.reduce((a, b) => a + b);
  }
}
