import Day from '../../day.ts';
import {
  parseDirectionsAndNodes,
  getNodesAndGraph,
  getStepCounts,
} from './part-a.ts';

export default class Day8B extends Day {
  constructor() {
    super({
      day: 8,
      challenge: 'B',

      sampleResult: '6',
    });
  }

  async answer(input: string) {
    const { directions, nodes } = parseDirectionsAndNodes(input);

    const { graph, nodesNames } = getNodesAndGraph(nodes);

    const startNodes = nodesNames.filter((node) => node.endsWith('A'));

    return getStepCounts(graph, startNodes, directions);
  }
}
