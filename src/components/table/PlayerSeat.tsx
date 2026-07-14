'use client';

import { motion } from 'framer-motion';
import { ClientPlayer } from '../../lib/types';
import Avatar from '../avatars/Avatar';
import CardBack from '../cards/CardBack';

interface PlayerSeatProps {
  player: ClientPlayer;
  seatIndex: number;
  totalSeats: number;
  isCurrentTurn: boolean;
  isLocalPlayer: boolean;
  playSignal: number; // increments when this player throws a card; 0 = never
}

function getSeatAngle(seatIndex: number, totalSeats: number): number {
  // seatIndex 0 = local player (always at bottom)
  // Others distributed clockwise around the table
  return (Math.PI / 2) + (seatIndex / totalSeats) * 2 * Math.PI;
}

export default function PlayerSeat({ player, seatIndex, totalSeats, isCurrentTurn, isLocalPlayer, playSignal }: PlayerSeatProps) {
  const angle = getSeatAngle(seatIndex, totalSeats);
  const pos = {
    left: `${50 + 45 * Math.cos(angle)}%`,
    top: `${50 + 42 * Math.sin(angle)}%`,
  };

  // Don't render seat for local player at table (their hand is at the bottom of the screen)
  if (isLocalPlayer) return null;

  // Lunge toward the table center when this player throws a card
  const lungeX = -Math.cos(angle) * 14;
  const lungeY = -Math.sin(angle) * 14;

  return (
    <div
      className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.left, top: pos.top }}
    >
      <motion.div
        key={playSignal}
        animate={playSignal > 0 ? {
          x: [0, lungeX, 0],
          y: [0, lungeY, 0],
          rotate: [0, lungeX > 0 ? 6 : -6, 0],
        } : {}}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Avatar
          avatarId={player.avatarId}
          size="md"
          isActive={isCurrentTurn}
          isDisconnected={false}
        />
      </motion.div>
      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
        isCurrentTurn ? 'bg-sunny text-ink' : 'bg-white/85 text-ink'
      }`}>
        {player.name}
      </span>

      {/* Show card backs for other players */}
      {!player.isOut && player.cardCount > 0 && (
        <div className="flex -space-x-3 mt-1">
          {Array.from({ length: Math.min(player.cardCount, 5) }).map((_, i) => (
            <div key={i} style={{ transform: `rotate(${(i - 2) * 8}deg)` }}>
              <CardBack small avatarId={player.avatarId} />
            </div>
          ))}
          {player.cardCount > 5 && (
            <span className="relative z-10 self-center ml-2 text-[10px] font-bold text-ink bg-white/90 px-1.5 py-0.5 rounded-full shadow-sm">
              ×{player.cardCount}
            </span>
          )}
        </div>
      )}

      {player.isOut && (
        <span className="text-xs text-teal-dark font-bold bg-white/85 px-2.5 py-0.5 rounded-full shadow-sm">Safe!</span>
      )}
    </div>
  );
}
