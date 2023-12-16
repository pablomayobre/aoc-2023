import Day from '../../day.ts';
import { Beam, MirrorMap, energizeMap } from './part-a.ts';

function generateStartingBeams(map: MirrorMap): Beam[] {
  let beams: Beam[] = []

  map.forEach((columns, index) => {
    beams.push({
      pos: [-1, index],
      direction: "East"
    }, {
      pos: [columns.length, index],
      direction: "West"
    })
  })

  map[0].forEach((_, index) => {
    beams.push({
      pos: [index, -1],
      direction: "South"
    }, {
      pos: [index, map.length],
      direction: "North"
    })
  })

  return beams
}

export default class Day16B extends Day {
  constructor() {
    super({
      day: 16,
      challenge: 'B',

      sampleResult: "51",
    });
  }

  async answer(input: string) {
    const map = input
      .trim()
      .split('\n')
      .map((row) => {
        return row.trim().split('');
      });

    const initialBeams = generateStartingBeams(map);

    const energy = initialBeams.map((beam) => energizeMap(beam, map))

    return Math.max(...energy);
  }
}
