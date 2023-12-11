import Day from '../../day.ts'
import { calculateLastDigit, generateFactors } from './part-a.ts'

export default class Day9B extends Day {
  constructor() {
    super({
      day: 9,
      challenge: "B",

      sampleResult: "2" 
    })
  }

  async answer(input: string) {
    const memo = new Map<number, number[]>()

    const lastDigits = input.trim().split("\n").map((line) => {
      const history = line.trim().split(" ").map((value) => parseInt(value))
      const factors = generateFactors(history.length + 1, memo)

      return -calculateLastDigit([0, ...history], factors);
    })

    return lastDigits.reduce((a, b) => a+b); 
  }
}
