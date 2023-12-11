import Day from '../../day.ts';

const digits = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

const regex = `\\d|${digits.join('|')}`;

function findFirstAndLastDigit(str: string) {
  const match = str.match(`(?=(${regex})).*(${regex})`);

  const matches = [];

  for (let i = 1; i <= 2; i++) {
    matches[i - 1] = +match[i] || digits.indexOf(match[i]) + 1;
  }

  return matches as [number, number];
}

export default class Day1B extends Day {
  constructor() {
    super({
      day: 1,
      challenge: 'B',

      sampleResult: '281',
    });
  }

  async answer(input: string) {
    const list = input
      .trim()
      .split('\n')
      .map((value) => {
        if (value.trim() === '') return 0;

        const [firstDigit, lastDigit] = findFirstAndLastDigit(value);

        return parseInt(`${firstDigit}${lastDigit}`);
      });

    return list.reduce((a, b) => a + b);
  }
}
