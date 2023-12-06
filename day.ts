export default class Day {
  readonly day: number;
  readonly challenge: 'A' | 'B';

  readonly sampleResult: string;

  constructor({
    day,
    challenge,
    sampleResult,
  }: {
    day: number;
    challenge: 'A' | 'B';
    sampleResult: string | number | null | undefined;
  }) {
    this.day = day;
    this.challenge = challenge;
    this.sampleResult = (sampleResult ?? '').toString();
  }

  async exec(file: string) {
    performance.mark('execution start');
    const result = await this.answer(file);
    performance.mark('execution end');

    const time = performance.measure(
      'execution time',
      'execution start',
      'execution end',
    ).duration;

    performance.clearMarks('execution start');
    performance.clearMarks('execution end');
    performance.clearMeasures('execution time');

    return { result, time };
  }

  async answer(input: string): Promise<string | number> {
    throw new Error('Not implemented');
  }
}
