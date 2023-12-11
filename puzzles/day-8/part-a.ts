import Day from '../../day.ts';

function gcd(a: number, b: number) {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

function lcm(a: number, b: number) {
  return (a / gcd(a, b)) * b;
}

type Graph = Map<string, { L: string; R: string }>;

export function getStepCounts(
  graph: Graph,
  startNodes: string[],
  directions: string,
) {
  let count = 0;
  let currentNodes = startNodes;

  let periods = new Map<number, number>();
  while (true) {
    const direction = directions[count % directions.length];

    currentNodes = currentNodes.map((current, index) => {
      const node = graph.get(current);

      const next = node[direction as 'L' | 'R'];

      if (next.endsWith('Z') && !periods.has(index)) {
        periods.set(index, count + 1);
      }

      return next;
    });

    count++;

    if (periods.size === currentNodes.length) break;
  }

  return [...periods.values()].reduce((prev, curr) => lcm(prev, curr), 1);
}

export function getNodesAndGraph(nodes: string[]) {
  const graph: Graph = new Map();

  const nodesNames = nodes
    .map((node) => {
      const [, nodeName, left, right] = node.match(
        /([^=\s]+)\s*=\s*\(\s*([^,)\s*]+)\s*,\s*([^)\s*]+)\s*\)/,
      );

      graph.set(nodeName, { L: left, R: right });

      return nodeName;
    })

  return { graph, nodesNames } as const;
}

export function parseDirectionsAndNodes(input: string) {
  const [directions, , ...nodes] = input
    .trim()
    .split('\n')
    .map((value) => value.trim());

  return { directions, nodes };
}

export default class Day8A extends Day {
  constructor() {
    super({
      day: 8,
      challenge: 'A',

      sampleResult: '2',
    });
  }

  async answer(input: string) {
    const { directions, nodes } = parseDirectionsAndNodes(input);

    const { graph } = getNodesAndGraph(nodes);

    return getStepCounts(graph, ['AAA'], directions);
  }
}
