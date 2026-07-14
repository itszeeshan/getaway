export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // e.g. "A-spades"
}

export interface Player {
  name: string;
  hand: Card[];
  isOut: boolean; // true when player has gotten away (no cards left)
  avatarId: string;
}

export interface TrickPlay {
  playerIndex: number;
  card: Card;
  isDump: boolean; // true if player couldn't follow suit and dumped
}

export type GamePhase =
  | 'setup'
  | 'lobby'
  | 'dealing'
  | 'playing'
  | 'trick-result'
  | 'trick-collecting'
  | 'game-over';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  phase: GamePhase;
  trick: TrickPlay[];
  leadSuit: Suit | null;
  trickWinnerIndex: number | null;
  roundNumber: number;
  loserIndex: number | null;
  message: string;
  isFirstTrick: boolean;
  finishOrder: number[]; // player indices in the order they got away
}

// Multiplayer types

export interface PlayerInfo {
  id: string;
  name: string;
  avatarId: string;
  isHost: boolean;
  isConnected: boolean;
}

export interface Room {
  code: string;
  players: PlayerInfo[];
  hostId: string;
  gameState: GameState | null;
  status: 'lobby' | 'playing' | 'finished';
}

export interface ClientPlayer {
  name: string;
  cardCount: number;
  hand: Card[] | null; // only populated for local player
  isOut: boolean;
  avatarId: string;
}

export interface ClientGameState {
  players: ClientPlayer[];
  currentPlayerIndex: number;
  phase: GamePhase;
  trick: TrickPlay[];
  leadSuit: Suit | null;
  trickWinnerIndex: number | null;
  roundNumber: number;
  loserIndex: number | null;
  message: string;
  isFirstTrick: boolean;
  finishOrder: number[];
  myPlayerIndex: number;
}
