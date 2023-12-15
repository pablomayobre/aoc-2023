import Day from '../../day.ts';

export function hashInstruction(input: string) {
  return [...input].reduce((hash, char) => {
    const ascii = char.charCodeAt(0);

    return ((hash + ascii) * 17) % 256;
  }, 0);
}

export default class Day15A extends Day {
  constructor() {
    super({
      day: 15,
      challenge: 'A',

      sampleResult: '1320',
    });
  }

  async answer(input: string) {
    const results = input.trim().split(',').map(hashInstruction);

    return results.reduce((a, b) => a + b);
  }
}
