import Day from '../../day.ts'
import { getOptimizedOptions, parseRaces } from './part-a.ts'

export default class Day6B extends Day {
  constructor() {
    super({
      day: 6,
      challenge: "B",
      
      sampleResult: "71503" 
    })
  }

  async answer(input: string) {
    const [timesLine, recordsLine] = input.split("\n").map((str) => str.replace(/\s/g, ""))

    const races = parseRaces(timesLine, recordsLine)

    const options = races.map(({time, record}) => getOptimizedOptions(time, record))
  
    return options.reduce((prev, curr) => prev * curr, 1); 
  }
}