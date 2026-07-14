import { GameState, ClientGameState, ClientPlayer } from '../lib/types';

export function filterStateForPlayer(
  state: GameState,
  playerIndex: number
): ClientGameState {
  const players: ClientPlayer[] = state.players.map((p, i) => ({
    name: p.name,
    cardCount: p.hand.length,
    hand: i === playerIndex ? p.hand : null,
    isOut: p.isOut,
    avatarId: p.avatarId,
  }));

  return {
    players,
    currentPlayerIndex: state.currentPlayerIndex,
    phase: state.phase,
    trick: state.trick,
    leadSuit: state.leadSuit,
    trickWinnerIndex: state.trickWinnerIndex,
    roundNumber: state.roundNumber,
    loserIndex: state.loserIndex,
    message: state.message,
    isFirstTrick: state.isFirstTrick,
    finishOrder: state.finishOrder,
    myPlayerIndex: playerIndex,
  };
}
