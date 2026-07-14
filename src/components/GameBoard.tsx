'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientGameState, Card as CardType } from '../lib/types';
import { getPlayableCards } from '../lib/gameLogic';
import { sounds } from '../lib/sounds';
import SoundToggle from './SoundToggle';
import CardTable from './table/CardTable';
import PlayerSeat from './table/PlayerSeat';
import TrickArea from './table/TrickArea';
import DealAnimation from './table/DealAnimation';
import CardFan from './cards/CardFan';
import Avatar from './avatars/Avatar';
import GameOver from './GameOver';
import IllustratedBackground from './landing/IllustratedBackground';

interface GameBoardProps {
  state: ClientGameState;
  onPlayCard: (card: CardType) => void;
  onDealComplete: () => void;
  onRestart: () => void;
}

export default function GameBoard({ state, onPlayCard, onDealComplete, onRestart }: GameBoardProps) {
  const myPlayer = state.players[state.myPlayerIndex];
  const myHand = myPlayer.hand || [];
  const isMyTurn = state.currentPlayerIndex === state.myPlayerIndex && state.phase === 'playing';

  const playableCards = isMyTurn
    ? getPlayableCards(myHand, state.leadSuit, state.isFirstTrick)
    : [];
  const playableCardIds = playableCards.map(c => c.id);

  // Reorder players so local player is index 0 (bottom of table)
  const reorderedPlayers = state.players.map((_, i) => {
    const actualIndex = (state.myPlayerIndex + i) % state.players.length;
    return { player: state.players[actualIndex], actualIndex };
  });

  const playerNames = state.players.map(p => p.name);

  // Who threw the most recent card (drives the seat "throw" reaction)
  const lastPlay = state.trick.length > 0 ? state.trick[state.trick.length - 1] : null;

  const handleDealComplete = useCallback(() => {
    onDealComplete();
  }, [onDealComplete]);

  // Sound effects driven by state changes (covers all players, not just local actions)
  const prevTrickLen = useRef(0);
  useEffect(() => {
    if (state.trick.length > prevTrickLen.current) sounds.cardPlay();
    prevTrickLen.current = state.trick.length;
  }, [state.trick.length]);

  useEffect(() => {
    if (isMyTurn) sounds.yourTurn();
  }, [isMyTurn]);

  const prevPhase = useRef(state.phase);
  useEffect(() => {
    if (state.phase === prevPhase.current) return;
    prevPhase.current = state.phase;
    if (state.phase === 'dealing') sounds.shuffle();
    if (state.phase === 'trick-result') sounds.trickResult();
    if (state.phase === 'game-over') {
      if (state.loserIndex === state.myPlayerIndex) sounds.lose();
      else sounds.win();
    }
  }, [state.phase, state.loserIndex, state.myPlayerIndex]);

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden">
      <IllustratedBackground subtle />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-2.5 z-10">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-ink/10 rounded-full px-4 py-1.5 shadow-md">
          <h1 className="font-display text-lg font-bold text-ink leading-none">Getaway</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink-soft bg-white/80 backdrop-blur-sm border-2 border-ink/10 px-4 py-1.5 rounded-full shadow-md">
            Round {state.roundNumber}
          </span>
          <SoundToggle />
        </div>
      </div>

      {/* Table area */}
      <div className="relative flex-1">
        <CardTable>
          {/* Player seats around table */}
          {reorderedPlayers.map(({ player, actualIndex }, seatIndex) => (
            <PlayerSeat
              key={actualIndex}
              player={player}
              seatIndex={seatIndex}
              totalSeats={state.players.length}
              isCurrentTurn={actualIndex === state.currentPlayerIndex}
              isLocalPlayer={seatIndex === 0}
              playSignal={lastPlay && lastPlay.playerIndex === actualIndex ? state.trick.length : 0}
            />
          ))}

          {/* Trick area in center */}
          <TrickArea
            trick={state.trick}
            leadSuit={state.leadSuit}
            playerNames={playerNames}
            trickWinnerIndex={state.trickWinnerIndex}
            myPlayerIndex={state.myPlayerIndex}
            totalPlayers={state.players.length}
          />

          {/* Deal animation */}
          {state.phase === 'dealing' && (
            <DealAnimation
              playerCount={state.players.length}
              onComplete={handleDealComplete}
            />
          )}
        </CardTable>

        {/* Trick result toast */}
        <AnimatePresence>
          {state.phase === 'trick-result' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-ink px-5 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-ink/10 z-30"
            >
              {state.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Local player hand tray */}
      <div className="relative z-10 px-3 pb-3">
        <div className={`panel-soft rounded-3xl max-w-4xl mx-auto px-5 pt-3 pb-4 transition-shadow ${
          isMyTurn ? 'ring-2 ring-sunny shadow-[0_0_24px_rgba(255,209,102,0.45)]' : ''
        }`}>
          <div className="flex items-center gap-3 mb-1">
            <Avatar avatarId={myPlayer.avatarId} size="sm" isActive={isMyTurn} />
            <div>
              <span className="text-ink font-bold text-sm">{myPlayer.name}</span>
              {isMyTurn && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-2 text-coral-dark text-xs font-bold"
                >
                  Your turn!
                </motion.span>
              )}
              {myPlayer.isOut && (
                <span className="ml-2 text-teal-dark text-xs font-bold">Safe!</span>
              )}
            </div>
            <span className="ml-auto text-ink-soft text-xs font-bold bg-white/80 px-2.5 py-1 rounded-full">
              {myHand.length} card{myHand.length === 1 ? '' : 's'}
            </span>
          </div>

          {myHand.length > 0 && (
            <CardFan
              cards={myHand}
              playableCardIds={playableCardIds}
              onPlayCard={onPlayCard}
              disabled={!isMyTurn}
            />
          )}
        </div>
      </div>

      {/* Game Over overlay */}
      {state.phase === 'game-over' && (
        <GameOver
          players={state.players}
          loserIndex={state.loserIndex}
          finishOrder={state.finishOrder}
          onRestart={onRestart}
        />
      )}
    </div>
  );
}
