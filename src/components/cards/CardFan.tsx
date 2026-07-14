'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../../lib/types';
import AnimatedCard from './AnimatedCard';

interface CardFanProps {
  cards: CardType[];
  playableCardIds: string[];
  onPlayCard: (card: CardType) => void;
  disabled?: boolean;
}

const CARD_WIDTH = 76;

export default function CardFan({ cards, playableCardIds, onPlayCard, disabled = false }: CardFanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const n = cards.length;
  // Spread cards across the available width; overlap only when the hand is big,
  // and never so much that the corner index is hidden.
  const spacing = n > 1
    ? Math.min(CARD_WIDTH + 8, Math.max(26, (width - CARD_WIDTH - 24) / (n - 1)))
    : 0;
  const maxTilt = Math.min(14, n * 1.2);

  return (
    <div ref={containerRef} className="relative flex items-end justify-center" style={{ height: '150px' }}>
      {cards.map((card, i) => {
        const centered = n > 1 ? i - (n - 1) / 2 : 0;
        const normalized = n > 1 ? centered / ((n - 1) / 2) : 0;
        const angle = normalized * maxTilt;
        const yOffset = normalized * normalized * 8;
        const isPlayable = !disabled && playableCardIds.includes(card.id);

        return (
          <motion.div
            key={card.id}
            className="absolute bottom-1"
            style={{ zIndex: i }}
            initial={false}
            animate={{
              x: centered * spacing,
              y: yOffset,
              rotate: angle,
            }}
            whileHover={isPlayable ? {
              y: -40,
              rotate: 0,
              scale: 1.12,
              zIndex: 50,
            } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <AnimatedCard
              card={card}
              playable={isPlayable}
              onClick={() => onPlayCard(card)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
