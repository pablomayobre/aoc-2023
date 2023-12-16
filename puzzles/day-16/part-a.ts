import Day from '../../day.ts';

export type Position = [number, number];

export type Beam = {
  pos: Position;
  direction: Direction;
};

export type MirrorMap = string[][];

export type EnergyMap = Set<Direction>[][];

const Directions = {
  North: [0, -1],
  South: [0, 1],
  East: [1, 0],
  West: [-1, 0],
} as Record<Direction, Position>;

type Direction = 'North' | 'South' | 'East' | 'West';

const Mirrors = ['|', '-', '/', '\\'];

function rotateDirection(mirror: '/' | '\\', direction: Direction) {
  switch (direction) {
    case 'North':
      if (mirror === '/') {
        return 'East';
      } else {
        return 'West';
      }
    case 'South':
      if (mirror === '/') {
        return 'West';
      } else {
        return 'East';
      }
    case 'East':
      if (mirror === '/') {
        return 'North';
      } else {
        return 'South';
      }
    case 'West':
      if (mirror === '/') {
        return 'South';
      } else {
        return 'North';
      }
  }
}

function splitDirections(
  mirror: '|' | '-',
  direction: Direction,
): null | Direction[] {
  if (mirror === '|') {
    if (direction === 'North' || direction === 'South') {
      return null;
    }

    return ['North', 'South'];
  } else {
    if (direction === 'West' || direction === 'East') {
      return null;
    }

    return ['West', 'East'];
  }
}

export function findMirrorAtPos(
  pos: Position,
  direction: Direction,
  map: MirrorMap,
): null | Beam[] {
  const tile = map[pos[1]][pos[0]];

  if (!tile || !Mirrors.includes(tile)) return null;

  if (tile === '/' || tile === '\\') {
    return [{ pos, direction: rotateDirection(tile, direction) }];
  }
  const dirs = splitDirections(tile as '|' | '-', direction);

  if (dirs) return dirs.map((direction): Beam => ({ pos, direction }));

  return null;
}

export function findNextMirrorOrSplitter(
  beam: Beam,
  map: MirrorMap,
  energyMap: Set<Direction>[][],
) {
  let pos = beam.pos;

  while (true) {
    pos = addVectors(pos, Directions[beam.direction]);

    if (pos[0] < 0) return null;
    if (pos[1] < 0) return null;
    if (pos[1] >= map.length) return null;
    if (pos[0] >= map[0].length) return null;

    if (energyMap[pos[1]]?.[pos[0]]?.has(beam.direction)) return null;

    const mirror = findMirrorAtPos(pos, beam.direction, map);

    energyMap[pos[1]] ??= [];
    energyMap[pos[1]][pos[0]] ??= new Set();
    energyMap[pos[1]][pos[0]].add(beam.direction);

    if (mirror) return mirror;
  }
}

function addVectors<T extends number[]>(a: T, b: T): T {
  const result = [] as T;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    result[i] = a[i] + b[i];
  }
  return result;
}

export function energizeMap(initialBeam: Beam, map: MirrorMap) {
  let beams = [initialBeam];

  const energyMap: EnergyMap = [];

  while (beams.length > 0) {
    beams = beams
      .flatMap((beam) => {
        return findNextMirrorOrSplitter(beam, map, energyMap);
      })
      .filter((beam) => Boolean(beam));
  }

  return energyMap.reduce((acc, row) => {
    return acc + (row?.reduce((acc, set) => acc + (set ? 1 : 0), 0) ?? 0);
  }, 0);
}

export default class Day16A extends Day {
  constructor() {
    super({
      day: 16,
      challenge: 'A',

      sampleResult: '46',
    });
  }

  async answer(input: string) {
    const map = input
      .trim()
      .split('\n')
      .map((row) => {
        return row.trim().split('');
      });

    const initialBeam: Beam = {
      pos: [-1, 0],
      direction: 'East',
    };

    return energizeMap(initialBeam, map);
  }
}
