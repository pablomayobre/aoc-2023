import Day from '../../day.ts';
import { Graph, ID, getLoopInformation, getGraph, Node } from './part-a.ts';

const VERTICAL_CHARS = ['F', '7', '|'];

function isVerticalLine(node: Node, loop: Set<ID>) {
  if (VERTICAL_CHARS.includes(node.character)) {
    return true;
  } else if (node.character === 'S') {
    if (loop.has(node.connectedNodes[0])) {
      return true;
    }
  }

  return false;
}

function findRectangles(
  graph: Graph,
  loop: Set<ID>,
  [minLine, maxLine]: readonly [number, number],
  [minPos, maxPos]: readonly [number, number],
) {
  let inside = new Set<ID>();

  for (let y = minLine; y <= maxLine; y++) {
    let lineCount = 0;

    for (let x = minPos; x <= maxPos; x++) {
      const id: ID = `${x}-${y}`;

      if (loop.has(id)) {
        const node = graph.get(id);

        if (isVerticalLine(node, loop)) {
          lineCount++;
        }
      } else {
        if (lineCount % 2 === 1) {
          inside.add(id);
        }
      }
    }
  }

  return inside;
}

export default class Day10B extends Day {
  constructor() {
    super({
      day: 10,
      challenge: 'B',

      sampleResult: '10',
    });
  }

  async answer(input: string) {
    const [graph, monster] = getGraph(input);

    const {
      distances,
      zone: { line, pos },
    } = getLoopInformation(graph, monster);

    const loop = new Set(distances.keys());

    const rectangles = findRectangles(graph, loop, line, pos);

    return rectangles.size;
  }
}
