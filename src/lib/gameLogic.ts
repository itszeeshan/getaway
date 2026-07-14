import { Card, GameState, Player, Suit, TrickPlay } from './types';
import { RANK_VALUES } from './constants';
import { dealCards } from './deck';

export function initializeGame(playerNames: string[], avatarIds?: string[]): GameState {
  const hands = dealCards(playerNames.length);
  const players: Player[] = playerNames.map((name, i) => ({
    name,
    hand: sortHand(hands[i]),
    isOut: false,
    avatarId: avatarIds?.[i] || 'default',
  }));

  // Find who has Ace of Spades
  const starterIndex = players.findIndex(p =>
    p.hand.some(c => c.id === 'A-spades')
  );

  return {
    players,
    currentPlayerIndex: starterIndex,
    phase: 'dealing',
    trick: [],
    leadSuit: null,
    trickWinnerIndex: null,
    roundNumber: 1,
    loserIndex: null,
    message: `${players[starterIndex].name} has the Ace of Spades and goes first!`,
    isFirstTrick: true,
    finishOrder: [],
  };
}

export function sortHand(hand: Card[]): Card[] {
  const suitOrder = { spades: 0, hearts: 1, diamonds: 2, clubs: 3 };
  return [...hand].sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return RANK_VALUES[a.rank] - RANK_VALUES[b.rank];
  });
}

export function canFollowSuit(hand: Card[], leadSuit: Suit): boolean {
  return hand.some(c => c.suit === leadSuit);
}

export function getPlayableCards(hand: Card[], leadSuit: Suit | null, isFirstTrick: boolean): Card[] {
  // First trick: must play Ace of Spades
  if (isFirstTrick && hand.some(c => c.id === 'A-spades')) {
    return hand.filter(c => c.id === 'A-spades');
  }

  // Leading a new trick: can play any card
  if (leadSuit === null) {
    return hand;
  }

  // Must follow suit if possible
  if (canFollowSuit(hand, leadSuit)) {
    return hand.filter(c => c.suit === leadSuit);
  }

  // Can't follow suit: can dump any card
  return hand;
}

export function playCard(state: GameState, card: Card): GameState {
  const newState = structuredClone(state);
  const player = newState.players[newState.currentPlayerIndex];

  // Remove card from hand
  player.hand = player.hand.filter(c => c.id !== card.id);

  const isLeading = newState.trick.length === 0;
  const isDump = !isLeading && newState.leadSuit !== null && card.suit !== newState.leadSuit;

  if (isLeading) {
    newState.leadSuit = card.suit;
    newState.trickWinnerIndex = newState.currentPlayerIndex;
  }

  // Track trick winner (highest card of lead suit)
  if (!isDump && newState.leadSuit === card.suit) {
    if (newState.trickWinnerIndex === null) {
      newState.trickWinnerIndex = newState.currentPlayerIndex;
    } else {
      const currentWinningPlay = newState.trick.find(
        t => t.playerIndex === newState.trickWinnerIndex && !t.isDump
      );
      if (isLeading || !currentWinningPlay || RANK_VALUES[card.rank] > RANK_VALUES[currentWinningPlay.card.rank]) {
        newState.trickWinnerIndex = newState.currentPlayerIndex;
      }
    }
  }

  newState.trick.push({
    playerIndex: newState.currentPlayerIndex,
    card,
    isDump,
  });

  // Check if player is now out
  if (player.hand.length === 0) {
    player.isOut = true;
    if (!newState.finishOrder.includes(newState.currentPlayerIndex)) {
      newState.finishOrder.push(newState.currentPlayerIndex);
    }
  }

  newState.isFirstTrick = false;

  // Check if all active players have played
  const activePlayers = newState.players.filter(p => !p.isOut);
  if (newState.trick.length >= activePlayers.length) {
    return resolveTrick(newState);
  }

  // Move to next active player
  newState.currentPlayerIndex = getNextActivePlayer(newState);
  newState.phase = 'playing';

  return newState;
}

function resolveTrick(state: GameState): GameState {
  const newState = structuredClone(state);
  const winnerIndex = newState.trickWinnerIndex!;
  const winner = newState.players[winnerIndex];

  // If anyone dumped, the trick winner picks up the ENTIRE pile —
  // every card played this trick, including their own.
  const hasDump = newState.trick.some(t => t.isDump);

  if (hasDump) {
    const pile = newState.trick.map(t => t.card);
    winner.hand.push(...pile);
    winner.hand = sortHand(winner.hand);
    winner.isOut = false; // they're holding cards again
    newState.finishOrder = newState.finishOrder.filter(i => i !== winnerIndex);
    newState.message = `${winner.name} got dumped on and picks up the pile (+${pile.length} cards)`;
  } else {
    newState.message = `${winner.name} wins the trick!`;
  }

  // Check game over
  const playersWithCards = newState.players.filter(p => !p.isOut);
  if (playersWithCards.length <= 1) {
    newState.phase = 'game-over';
    newState.loserIndex = playersWithCards.length === 1
      ? newState.players.indexOf(playersWithCards[0])
      : null;
    newState.message = playersWithCards.length === 1
      ? `${playersWithCards[0].name} is the loser!`
      : 'Game over!';
    return newState;
  }

  // Set up next trick
  newState.trick = [];
  newState.leadSuit = null;
  newState.roundNumber++;

  // Winner leads next trick (if still in, otherwise next active)
  if (winner.isOut) {
    newState.currentPlayerIndex = getNextActivePlayerFrom(newState, winnerIndex);
  } else {
    newState.currentPlayerIndex = winnerIndex;
  }

  newState.trickWinnerIndex = null;
  newState.phase = 'trick-result';

  return newState;
}

function getNextActivePlayer(state: GameState): number {
  let next = (state.currentPlayerIndex + 1) % state.players.length;
  while (state.players[next].isOut) {
    next = (next + 1) % state.players.length;
  }
  return next;
}

function getNextActivePlayerFrom(state: GameState, fromIndex: number): number {
  let next = (fromIndex + 1) % state.players.length;
  while (state.players[next].isOut) {
    next = (next + 1) % state.players.length;
  }
  return next;
}
