'use client';

import { motion } from 'framer-motion';
import { getAvatar } from '../../lib/avatars';
import CharacterArt from './CharacterArt';

interface AvatarProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  isDisconnected?: boolean;
}

const sizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-24 h-24',
  xl: 'w-36 h-36',
};

export default function Avatar({ avatarId, size = 'md', isActive = false, isDisconnected = false }: AvatarProps) {
  const character = getAvatar(avatarId);

  return (
    <motion.div
      animate={isActive ? { y: [0, -4, 0] } : { y: 0 }}
      transition={isActive ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      className={`
        ${sizes[size]} rounded-full overflow-hidden select-none
        border-[3px] shadow-lg bg-white
        ${isActive ? 'border-sunny ring-2 ring-sunny/60' : 'border-white'}
        ${isDisconnected ? 'opacity-40 grayscale' : ''}
      `}
    >
      <CharacterArt character={character} className="w-full h-full" />
    </motion.div>
  );
}
