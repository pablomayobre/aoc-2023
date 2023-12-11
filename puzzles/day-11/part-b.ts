import Day from '../../day.ts'
import { getAllDistances, parseGalaxies } from './part-a.ts';

export default class Day11B extends Day {
  constructor() {
    super({
      day: 11,
      challenge: "B",
      
      sampleResult: "82000210" 
    })
  }

  async answer(input: string) {
    const {galaxies, emptyRows, emptyCols} = parseGalaxies(input)

    const distances = getAllDistances(
      galaxies,
      emptyRows,
      emptyCols,
      1000000
    );

    return distances.reduce((a, b) => a+b);
  }
}
