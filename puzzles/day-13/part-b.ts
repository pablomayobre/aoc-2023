import Day from '../../day.ts'
import { findMirror, parseMirrorPatterns } from './part-a.ts';

export default class Day13B extends Day {
  constructor() {
    super({
      day: 13,
      challenge: "B",
      
      sampleResult: "400" 
    })
  }

  async answer(input: string) {
    const patterns = parseMirrorPatterns(input)

    return patterns
      .map((pattern) => findMirror(pattern, 1))
      .reduce((a, b) => a + b);
  }
}
