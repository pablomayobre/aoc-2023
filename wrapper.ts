import { mkdir, open, rm, stat, writeFile, readFile } from 'fs/promises';
import type Day from './day.ts';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

export const YEAR = 2023;

const execute = promisify(exec);

export async function exists(path: string) {
  return await stat(path)
    .then(() => true)
    .catch(() => false);
}

export function dayTemplate(day: number, challenge: 'A' | 'B') {
  return `import Day from '../../day.ts'

export default class Day${day}${challenge} extends Day {
  constructor() {
    super({
      day: ${day},
      challenge: "${challenge}",
      
      // The result of the algorithm using sample data
      sampleResult: null 
    })
  }

  async answer(input: string) {
    // Write your code here


    // Return your result
    return 0; 
  }
}`;
}

export async function downloadData(day: number, challenge: 'A' | 'B') {
  console.log(
    `Download and create files for day ${day} (challenge ${challenge})`,
  );

  const path = `./puzzles/day-${day}`;

  // Typescript code
  if (!(await exists(`${path}/part-${challenge.toLowerCase()}.ts`))) {
    await writeFile(
      `${path}/part-${challenge.toLowerCase()}.ts`,
      dayTemplate(day, challenge),
    );
  }

  // Sample data
  if (challenge === 'B' && (await exists(`${path}/part-a.sample-data.txt`))) {
    await writeFile(
      `${path}/part-${challenge.toLowerCase()}.sample-data.txt`,
      await readFile(`${path}/part-a.sample-data.txt`),
    );
  } else {
    await (
      await open(`${path}/part-${challenge.toLowerCase()}.sample-data.txt`, 'a')
    ).close();
  }

  // Remove puzzle and data
  if (await exists(`${path}/data.txt`)) {
    console.log('Removing data', await rm(`${path}/data.txt`));
  }

  if (await exists(`${path}/puzzle.md`)) {
    console.log('Removing puzzle', await rm(`${path}/puzzle.md`));
  }

  // Download puzzle and data from AOC
  await execute(
    `aoc download --year ${YEAR} --day ${day} --input-file ${path}/data.txt --puzzle-file ${path}/puzzle.md`,
  );
}

export async function createChallengeDirectory(
  day: number,
  challenge: 'A' | 'B' = 'A',
) {
  await mkdir(`./puzzles/day-${day}/`, { recursive: true });

  await downloadData(day, challenge);
}

export async function executeDay(
  dayNumber: number,
  challenge: 'A' | 'B',
  useSampleData?: boolean,
  dontSubmit?: boolean,
) {
  const path = `./puzzles/day-${dayNumber}/part-${challenge.toLowerCase()}.ts`;

  if (await exists(path)) {
    const { default: day } = (await import(path)) as {
      default: { new (): Day };
    };

    const instance = new day();

    const result = await instance.exec(
      useSampleData ? 'sample' : 'challenge',
      dontSubmit,
    );

    console.log("")

    if (!dontSubmit) {
      console.log(
        result
          ? chalk.green.bold(`✅  -  You have solved the challenge`)
          : chalk.red.bold(`❎  -  That's not the right solution, try again${
              useSampleData ? '' : ' in a couple minutes'
            }`),
      );
    }

    if (result && challenge === 'A' && !useSampleData) {
      await downloadData(dayNumber, 'B');
    }
  }
}
