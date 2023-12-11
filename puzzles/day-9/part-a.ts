import Day from '../../day.ts'

export function calculateLastDigit (history: number[], factors: number[]) {
  return history.reduce((acc, current, index) => {
    const symbol = index % 2 === 0 ? 1 : -1;

    return acc + (symbol * factors[index] * current)
  }, 0)
}


export function generateFactors (n: number, map: Map<number, number[]>){
  let factors = map.get(n)

  if (factors) return factors;
  if (n === 2) return [1, 1];

  const prevFactors = generateFactors(n - 1, map);
  factors = [1]

  for (let i=0; i < prevFactors.length; i++) {
    factors.push(prevFactors[i] + (prevFactors[i+1] ?? 0))
  }

  map.set(n, factors)

  return factors
}

export default class Day9A extends Day {
  constructor() {
    super({
      day: 9,
      challenge: "A",

      sampleResult: "114" 
    })
  }

  async answer(input: string) {
    const memo = new Map<number, number[]>()

    const lastDigits = input.trim().split("\n").map((line) => {
      const history = line.trim().split(" ").map((value) => parseInt(value))
      const factors = generateFactors(history.length + 1, memo)

      return calculateLastDigit(history, factors);
    })

    return lastDigits.reduce((a, b) => a+b); 
  }
}
