'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { TrickPlay } from '../../lib/types';
import { SUIT_SYMBOLS } from '../../lib/constants';
import AnimatedCard from '../cards/AnimatedCard';
import { Suit } from '../../lib/types';

interface TrickAreaProps {
  trick: TrickPlay[];
  leadSuit: Suit | null;
  playerNames: string[];
  trickWinnerIndex: number | null;
  myPlayerIndex: number;
  totalPlayers: number;
}

function getCardPosition(index: number, total: number): { x: number; y: number; rotate: number } {
  if (total <= 1) return { x: 0, y: 0, rotate: 0 };
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 30;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    rotate: (index - total / 2) * 5,
  };
}

// Where the card gets thrown from: the direction of the player's seat
// (same angle formula as PlayerSeat, seat 0 = local player at the bottom).
function getThrowOrigin(playerIndex: number, myPlayerIndex: number, totalPlayers: number): { x: number; y: number } {
  const seatIndex = ((playerIndex - myPlayerIndex) % totalPlayers + totalPlayers) % totalPlayers;
  const angle = Math.PI / 2 + (seatIndex / totalPlayers) * 2 * Math.PI;
  return {
    x: Math.cos(angle) * 280,
    y: Math.sin(angle) * 200,
  };
}

export default function TrickArea({ trick, leadSuit, playerNames, trickWinnerIndex, myPlayerIndex, totalPlayers }: TrickAreaProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative" style={{ width: '200px', height: '120px' }}>
        {leadSuit && trick.length > 0 && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/25 text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            Lead: {SUIT_SYMBOLS[leadSuit]}
          </div>
        )}

        <AnimatePresence>
          {trick.map((play, i) => {
            const pos = getCardPosition(i, trick.length);
            const origin = getThrowOrigin(play.playerIndex, myPlayerIndex, totalPlayers);
            const spin = (play.playerIndex % 2 === 0 ? 1 : -1) * 200;
            const isWinner = play.playerIndex === trickWinnerIndex;
            return (
              <motion.div
                key={play.card.id}
                className="absolute left-1/2 top-1/2"
                initial={{
                  x: origin.x - 24,
                  y: origin.y - 36,
                  rotate: pos.rotate + spin,
                  scale: 1.3,
                  opacity: 0.9,
                }}
                animate={{
                  x: pos.x - 24,
                  y: pos.y - 36,
                  rotate: pos.rotate,
                  scale: 1,
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 170, damping: 19, mass: 0.9 }}
              >
                <div className="relative">
                  <AnimatedCard card={play.card} small />
                  <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold ${
                    play.isDump ? 'text-red-200' : isWinner ? 'text-yellow-200' : 'text-white/70'
                  }`}>
                    {playerNames[play.playerIndex]}
                    {play.isDump && ' ✗'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {trick.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/80 text-sm font-semibold bg-black/15 px-4 py-1.5 rounded-full">
              Play a card
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
