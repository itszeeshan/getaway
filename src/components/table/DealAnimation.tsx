'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import CardBack from '../cards/CardBack';

interface DealAnimationProps {
  playerCount: number;
  onComplete: () => void;
}

export default function DealAnimation({ playerCount, onComplete }: DealAnimationProps) {
  const [dealingCards, setDealingCards] = useState<number[]>([]);
  const [shuffling, setShuffling] = useState(true);
  const cardsPerPlayer = Math.floor(52 / playerCount);
  const totalCards = cardsPerPlayer * playerCount;

  useEffect(() => {
    // Shuffle animation for 1s, then deal
    const shuffleTimer = setTimeout(() => {
      setShuffling(false);
      // Deal cards one by one
      let dealt = 0;
      const dealInterval = setInterval(() => {
        if (dealt >= totalCards) {
          clearInterval(dealInterval);
          setTimeout(onComplete, 400);
          return;
        }
        setDealingCards(prev => [...prev, dealt]);
        dealt++;
      }, 40);
    }, 1200);

    return () => clearTimeout(shuffleTimer);
  }, [totalCards, onComplete]);

  // Calculate positions for each player seat
  const getTargetPosition = (cardIndex: number) => {
    const playerIdx = cardIndex % playerCount;
    const angle = (Math.PI / 2) + (playerIdx / playerCount) * 2 * Math.PI;

    // Player 0 is local (bottom), so for them cards go down
    if (playerIdx === 0) {
      return { x: 0, y: 200 };
    }

    return {
      x: Math.cos(angle) * 200,
      y: Math.sin(angle) * 150,
    };
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-40">
      {/* Deck in center */}
      <AnimatePresence>
        {shuffling && (
          <motion.div
            className="relative"
            animate={{
              rotate: [0, -5, 5, -3, 3, 0],
              scale: [1, 1.05, 0.95, 1.03, 0.97, 1],
            }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ top: -i * 2, left: -i * 1 }}
                animate={{
                  x: [0, i % 2 === 0 ? 15 : -15, 0],
                  rotate: [0, i % 2 === 0 ? 8 : -8, 0],
                }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05, repeat: 1 }}
              >
                <CardBack />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying cards */}
      {dealingCards.map((cardIdx) => {
        const target = getTargetPosition(cardIdx);
        return (
          <motion.div
            key={cardIdx}
            className="absolute"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: target.x,
              y: target.y,
              opacity: 0,
              scale: 0.6,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <CardBack small />
          </motion.div>
        );
      })}
    </div>
  );
}
