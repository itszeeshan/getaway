'use client';

import { motion } from 'framer-motion';
import { Card as CardType } from '../../lib/types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../../lib/constants';

interface AnimatedCardProps {
  card: CardType;
  playable?: boolean;
  onClick?: () => void;
  small?: boolean;
  layoutId?: string;
}

export default function AnimatedCard({ card, playable = false, onClick, small = false, layoutId }: AnimatedCardProps) {
  const symbol = SUIT_SYMBOLS[card.suit];
  const colorClass = SUIT_COLORS[card.suit];

  return (
    <motion.div
      layoutId={layoutId || card.id}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <button
        onClick={playable ? onClick : undefined}
        disabled={!playable}
        className={`
          relative inline-flex flex-col bg-white select-none
          ${small ? 'w-12 h-[72px] p-1 rounded-lg' : 'w-[76px] h-28 p-1.5 rounded-xl'}
          border-2 transition-all duration-150
          ${playable
            ? 'cursor-pointer border-ink/15 shadow-lg hover:shadow-xl hover:border-teal ring-1 ring-black/5'
            : 'cursor-default border-ink/10 shadow-md'
          }
          ${!playable && !small ? 'opacity-70 saturate-[0.85]' : ''}
          ${colorClass}
        `}
      >
        {/* Top-left index */}
        <span className={`absolute top-1 left-1.5 flex flex-col items-center leading-none font-bold ${small ? 'text-[11px]' : 'text-base'}`}>
          {card.rank}
          <span className={small ? 'text-[9px]' : 'text-xs'}>{symbol}</span>
        </span>

        {/* Center pip */}
        <span className={`m-auto leading-none ${small ? 'text-xl' : 'text-4xl'}`}>
          {symbol}
        </span>

        {/* Bottom-right index (rotated) */}
        <span className={`absolute bottom-1 right-1.5 rotate-180 flex flex-col items-center leading-none font-bold ${small ? 'text-[11px]' : 'text-base'}`}>
          {card.rank}
          <span className={small ? 'text-[9px]' : 'text-xs'}>{symbol}</span>
        </span>
      </button>
    </motion.div>
  );
}
