'use client';

import { motion } from 'framer-motion';
import { ClientPlayer } from '../lib/types';
import Avatar from './avatars/Avatar';

interface GameOverProps {
  players: ClientPlayer[];
  loserIndex: number | null;
  finishOrder: number[];
  onRestart: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function GameOver({ players, loserIndex, finishOrder, onRestart }: GameOverProps) {
  const loser = loserIndex !== null ? players[loserIndex] : null;

  // Winner = first player to get away; fall back to any non-loser
  const winnerIndex = finishOrder.length > 0
    ? finishOrder[0]
    : players.findIndex((_, i) => i !== loserIndex);
  const winner = winnerIndex >= 0 ? players[winnerIndex] : null;
  const runnersUp = finishOrder.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-ink/40 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-cream rounded-3xl p-8 max-w-sm w-full mx-4 text-center border-4 border-white shadow-2xl"
      >
        {/* Winner */}
        {winner && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-col items-center"
          >
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 12 }}
              className="text-4xl -mb-2 z-10"
            >
              👑
            </motion.span>
            <Avatar avatarId={winner.avatarId} size="lg" isActive />
            <p className="font-display text-2xl font-bold text-ink mt-2">
              {winner.name} wins!
            </p>
            <p className="text-teal-dark text-sm font-semibold">First to get away</p>
          </motion.div>
        )}

        {/* Runners-up in finish order */}
        {runnersUp.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <p className="text-ink-soft text-xs font-bold uppercase tracking-wider mb-2">Also got away</p>
            <div className="flex justify-center gap-4">
              {runnersUp.map((idx, rank) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <Avatar avatarId={players[idx].avatarId} size="sm" />
                    <span className="absolute -bottom-1 -right-1 text-sm">
                      {MEDALS[rank + 1] || '🎉'}
                    </span>
                  </div>
                  <span className="text-ink font-semibold text-xs">{players[idx].name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loser */}
        {loser && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mb-8 bg-coral/10 border-2 border-coral/25 rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <Avatar avatarId={loser.avatarId} size="sm" />
            <div className="text-left">
              <p className="text-coral-dark font-bold text-sm">{loser.name} got caught!</p>
              <p className="text-ink-soft text-xs font-medium">
                Stuck with {loser.cardCount} card{loser.cardCount === 1 ? '' : 's'}
              </p>
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onRestart}
          className="btn-sticker w-full py-3.5 bg-coral text-white font-display font-bold text-lg rounded-2xl"
        >
          Play Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
