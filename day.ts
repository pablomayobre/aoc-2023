import { readFile } from 'fs/promises';
import { exec } from 'child_process';
import { YEAR } from './wrapper.ts';
import chalk from 'chalk';

export default class Day {
  readonly day: number;
  readonly challenge: 'A' | 'B';

  private sampleResult: string;

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

  async exec(data: 'sample' | 'challenge' = 'challenge', dontSubmit?: boolean) {
    const fileName = `./puzzles/day-${this.day}/${
      data === 'sample'
        ? `part-${this.challenge.toLowerCase()}.sample-data`
        : 'data'
    }.txt`;
    const file = (await readFile(fileName)).toString();

    performance.mark("execution start")
    const result = await this.answer(file);
    performance.mark("execution end")

    console.log(chalk.bold(`Your answer was: ${chalk.inverse(` ${result} `)}`));
    console.log(`Execution time: ${performance.measure("execution time", "execution start", "execution end").duration}ms`)

    performance.clearMarks("execution start")
    performance.clearMarks("execution end")
    performance.clearMeasures("execution time")

    if (dontSubmit) {
      return false;
    }

    if (data === 'sample') {
      if (this.sampleResult === '') {
        throw new Error(
          "Don't forget to pass a sampleResult to the super() constructor. You should be able to find the value in your puzzle description.",
        );
      }

      return this.sampleResult === result.toString();
    } else {
      const passed = await this.submit(result.toString());

      return passed;
    }
  }

  submit(result: string) {
    return new Promise<boolean>((resolve, reject) =>
      exec(
        `aoc submit ${this.challenge === 'A' ? 1 : 2} ${result} -y ${YEAR} -d ${
          this.day
        }`,
        (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          }

          const message = stdout.trim().toLowerCase();
          if (message.startsWith("that's not the right answer")) {
            return resolve(false);
          }
          if (message.startsWith("that's the right answer!")) {
            return resolve(true);
          }
          return reject(new Error(`Unknown message from AOC:\n${message}`));
        },
      ),
    );
  }

  async answer(input: string): Promise<string | number> {
    throw new Error('Not implemented');
  }
}
