import Day from '../../day.ts';
import {
  Hand,
  countCards,
  debugHand,
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

function getHandType(hand: number[]) {
  const counts = countCards(hand);

  let jokers = counts.get(1) ?? 0;

  if (jokers !== 5) {
    counts.delete(1);
  } else {
    jokers = 0;
  }

  const sortedCounts = Array.from(counts.values()).sort((a, b) => b - a);
  sortedCounts[0] += jokers;

  let type: number = 0;
  for (let value of sortedCounts) {
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
