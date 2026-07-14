import { Card } from './types';
import { SUITS, RANKS } from './constants';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${rank}-${suit}` });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(playerCount: number): Card[][] {
  const deck = shuffleDeck(createDeck());
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  const cardsPerPlayer = Math.floor(52 / playerCount);

  for (let i = 0; i < cardsPerPlayer * playerCount; i++) {
    hands[i % playerCount].push(deck[i]);
  }

  return hands;
}
