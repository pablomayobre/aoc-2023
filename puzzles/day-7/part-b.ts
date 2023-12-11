import Day from '../../day.ts';
import {
  Hand,
  countCards,
  getBidResult,
  getNextType,
} from './part-a.ts';

const cardMap = [
  '',
  'J',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'Q',
  'K',
  'A',
];

const joker = 1

function findHighestCard (counts: Map<number, number>) {
  let max = [-1, -1] as [number, number];

  for (const entry of counts.entries()) {
    if (entry[1] >= 2) return entry;

    if (entry[1] > max[1]) max = entry;
  }

  return max;
}

function addWildcards(counts: Map<number, number>) {
  let wildcards = counts.get(joker) ?? 0;

  if (wildcards > 0 && wildcards !== 5) {
    counts.delete(joker);

    const maxCard = findHighestCard(counts)

    counts.set(maxCard[0], maxCard[1] + wildcards);
  } else {
    wildcards = 0;
  }

  return counts
}

function getHandType(hand: number[]) {
  const counts = addWildcards(countCards(hand));

  let type: number = 0;
  for (let value of counts.values()) {
    type = getNextType(value, type);
  }

  return type;
}

export default class Day7B extends Day {
  constructor() {
    super({
      day: 7,
      challenge: 'B',

      sampleResult: '5905',
    });
  }

  async answer(input: string) {
    const hands = input
      .trim()
      .split('\n')
      .map((line): Hand => {
        const [rawHand, bid] = line.split(' ');
        const hand = [...rawHand.trim()].map((value) => cardMap.indexOf(value));
        const type = getHandType(hand);

        return {
          hand,
          bid: parseInt(bid.trim()),
          type,
        };
      });

    return getBidResult(hands);
  }
}
