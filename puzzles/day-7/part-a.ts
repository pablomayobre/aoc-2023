import Day from '../../day.ts';

const cardMap = [
  '',
  '',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
];

export const typeMap = [
  'High card',
  'One pair',
  'Two pair',
  'Three of a kind',
  'Full house',
  'Four of a kind',
  'Five of a kind',
];

export type Hand = {
  hand: number[];
  bid: number;
  type: number;
};

export function debugHand(hand: Hand, cardMap: string[]) {
  console.log(
    hand.hand.map((value) => cardMap[value]),
    hand.bid,
    typeMap[hand.type],
  );
}

export function countCards(hand: number[]) {
  const counts = new Map<number, number>();

  hand.forEach((card) => {
    counts.set(card, (counts.get(card) ?? 0) + 1);
  });

  return counts;
}

export function getNextType(cardCount: number, currentType = 0) {
  switch (cardCount) {
    case 2: {
      switch (currentType) {
        case 1:
          return 2;
        case 3:
          return 4;
        default:
          return 1;
      }
    }
    case 3: {
      switch (currentType) {
        case 1:
          return 4;
        default:
          return 3;
      }
    }
    case 4: {
      return 5;
    }
    case 5: {
      return 6;
    }
    default: {
      return currentType;
    }
  }
}

function getHandType(hand: number[]) {
  const counts = countCards(hand);

  let type: number = 0;
  for (const value of counts.values()) {
    type = getNextType(value, type);
  }

  return type;
}

export function getBidResult(hands: Hand[], cardMap?: string[]) {
  return hands
    .sort((a, b) => {
      if (a.type !== b.type) return a.type - b.type;

      const nonEqual = a.hand.findIndex((value, index) => {
        return b.hand[index] !== value;
      });

      return a.hand[nonEqual] - b.hand[nonEqual];
    })
    .reduce((prev, hand, index) => {
      const rank = index + 1;
      const bidPerRank = rank * hand.bid;

      if (cardMap) debugHand(hand, cardMap);

      return prev + bidPerRank;
    }, 0);
}

export default class Day7A extends Day {
  constructor() {
    super({
      day: 7,
      challenge: 'A',

      sampleResult: '6440',
    });
  }

  async answer(input: string) {
    const hands = input
      .trim()
      .split('\n')
      .map((line) => {
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
