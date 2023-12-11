import Day from '../../day.ts'


export function getOptimizedOptions (time: number, record: number) {
  const a = (-time - Math.sqrt(time ** 2 - 4 * record)) / -2
  const b = (-time + Math.sqrt(time ** 2 - 4 * record)) / -2

  const min = Math.floor(Math.min(a, b) + 1)
  const max = Math.ceil(Math.max(a, b) - 1)

  return max - min + 1
}

/* // Brute force solution
export function getOptions (time: number, record: number) {
  const options: {holdTime: number, travelTime: number}[] = []
  
  for (let holdTime=1; holdTime < time; holdTime++) {
    const travelTime = time - holdTime;
    const distance = holdTime * travelTime;
    
    if (distance > record) {
      console.log("Hold", holdTime)
      options.push({ holdTime, travelTime })
    }
  }

  return options.length
}
*/

export function parseRaces (timesLine: string, recordsLine: string) {
  const times = [...timesLine.matchAll(/\d+/g)].flat()
  const records = [...recordsLine.matchAll(/\d+/g)].flat()

  if (times.length !== records.length) {
    throw new Error(`Mismatched number of times (${times.length}) and distances (${records.length})`)
  }

  return times.map((time, index) => {
    return {
      time: parseInt(time),
      record: parseInt(records[index])
    }
  })
}

export default class Day6A extends Day {
  constructor() {
    super({
      day: 6,
      challenge: "A",
      
      // The result of the algorithm using sample data
      sampleResult: "288" 
    })
  }

  async answer(input: string) {
    // Write your code here
    const [timesLine, recordsLine] = input.split("\n")

    const races = parseRaces(timesLine, recordsLine)

    const options = races.map(({time, record}) => getOptimizedOptions(time, record))


    // Return your result
    return options.reduce((prev, curr) => prev * curr, 1); 
  }
}