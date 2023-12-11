import Day from '../../day.ts';

export default class Day1A extends Day {
  constructor() {
    super({
      day: 1,
      challenge: 'A',

      sampleResult: '142',
    });
  }

  async answer(input: string) {
    const list = input.split('\n').map((value) => {
      if (value.trim() === '') return 0;

      const firstDigit = /^\D*(\d)/g.exec(value)?.[1];
      const lastDigit = /(\d)\D*$/g.exec(value)?.[1];

      return parseInt(`${firstDigit}${lastDigit}`);
    });

    return list.reduce((a, b) => a + b);
  }
}
