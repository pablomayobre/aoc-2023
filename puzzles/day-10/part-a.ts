import Day from '../../day.ts';

export type ID = `${number}-${number}`;

export type Node = {
  pos: number;
  line: number;
  character: string;
  connectedNodes: ID[];
};

export type Graph = Map<ID, Node>;

function getConnectedNodes(pos: number, line: number, character: string): ID[] {
  switch (character) {
    case '-':
      return [`${pos - 1}-${line}`, `${pos + 1}-${line}`];
    case '|':
      return [`${pos}-${line - 1}`, `${pos}-${line + 1}`];
    case 'L':
      return [`${pos}-${line - 1}`, `${pos + 1}-${line}`];
    case 'F':
      return [`${pos}-${line + 1}`, `${pos + 1}-${line}`];
    case '7':
      return [`${pos}-${line + 1}`, `${pos - 1}-${line}`];
    case 'J':
      return [`${pos}-${line - 1}`, `${pos - 1}-${line}`];
    case 'S':
      return [
        `${pos}-${line - 1}`, // South
        `${pos}-${line + 1}`,
        `${pos + 1}-${line}`,
        `${pos - 1}-${line}`,
      ];
    default:
      return [];
  }
}

export function getGraph(input: string) {
  let monster: ID = null;

  const graph = new Map(
    input
      .trim()
      .split('\n')
      .flatMap((value, line) => {
        return [...value.matchAll(/(L|J|7|F|S|\||\-)/g)].map(
          (match): [ID, Node] => {
            const id: ID = `${match.index}-${line}`;

            const node: Node = {
              pos: match.index,
              line,
              character: match[0],
              connectedNodes: getConnectedNodes(match.index, line, match[0]),
            };

            if (match[0] === 'S') {
              monster = id;
            }

            return [id, node];
          },
        );
      }),
  );

  return [graph, monster] as const;
}

export function getLoopInformation(graph: Graph, startPosition: ID) {
  const distances = new Map<ID, number>([[startPosition, 0]]);
  let distance = 0;

  let lowestLine = Number.MAX_SAFE_INTEGER;
  let lowestPos = Number.MAX_SAFE_INTEGER;
  let maxLine = 0;
  let maxPos = 0;

  let currentNodes = [startPosition];

  while (true) {
    let nextNodes = currentNodes.flatMap((id) => {
      const node = graph.get(id);
      if (!node) return [];

      distances.set(id, distance);

      lowestLine = Math.min(lowestLine, node.line);
      maxLine = Math.max(maxLine, node.line);
      lowestPos = Math.min(lowestPos, node.pos);
      maxPos = Math.max(maxPos, node.pos);

      return graph.get(id).connectedNodes.filter((nextId) => {
        const node = graph.get(nextId);

        if (!node || !node.connectedNodes.includes(id)) return false;

        return !distances.has(nextId);
      });
    });

    if (nextNodes.length === 0) {
      break;
    } else {
      distance++;
      currentNodes = nextNodes;
    }
  }

  return {
    distances,
    lastNodes: currentNodes,
    zone: {
      line: [lowestLine, maxLine],
      pos: [lowestPos, maxPos],
    },
  } as const;
}

export default class Day10A extends Day {
  constructor() {
    super({
      day: 10,
      challenge: 'A',

      // The result of the algorithm using sample data
      sampleResult: '4',
    });
  }

  async answer(input: string) {
    const [graph, monster] = getGraph(input);

    const { distances, lastNodes } = getLoopInformation(graph, monster);

    const maxDistance = lastNodes.map((id) => distances.get(id)).at(0);

    return maxDistance;
  }
}
