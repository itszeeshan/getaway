'use client';

import { CardTheme, getAvatar } from '../../lib/avatars';

interface CardBackProps {
  small?: boolean;
  avatarId?: string; // owner's character — colors the skin; omit for the neutral deck
}

const NEUTRAL: CardTheme = {
  primary: '#6b7a8f',
  dark: '#47546b',
  light: '#d3dce8',
  accent: '#ffd166',
};

/**
 * Flat geometric card back in the owner's character palette:
 * white frame, colored panel, nested diamond motif with corner dots.
 */
export default function CardBack({ small = false, avatarId }: CardBackProps) {
  const theme = avatarId ? getAvatar(avatarId).card : NEUTRAL;
  const gradId = `cb-${avatarId || 'neutral'}`;

  return (
    <svg
      viewBox="0 0 60 90"
      className={`${small ? 'w-8 h-12' : 'w-14 h-[84px]'} drop-shadow-md`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.primary} />
          <stop offset="100%" stopColor={theme.dark} />
        </linearGradient>
      </defs>

      {/* White frame */}
      <rect width="60" height="90" rx="6" fill="#ffffff" />
      {/* Colored panel */}
      <rect x="4" y="4" width="52" height="82" rx="4" fill={`url(#${gradId})`} />

      {/* Diagonal cross lines */}
      <g stroke={theme.light} strokeWidth="1" opacity="0.45">
        <path d="M 4 20 L 30 45 L 4 70" fill="none" />
        <path d="M 56 20 L 30 45 L 56 70" fill="none" />
        <path d="M 30 4 L 30 22 M 30 68 L 30 86" />
      </g>

      {/* Nested center diamonds */}
      <g fill="none">
        <path d="M 30 17 L 51 45 L 30 73 L 9 45 Z" stroke={theme.light} strokeWidth="1.5" opacity="0.8" />
        <path d="M 30 25 L 45 45 L 30 65 L 15 45 Z" stroke={theme.accent} strokeWidth="1.5" />
        <path d="M 30 33 L 39 45 L 30 57 L 21 45 Z" fill={theme.dark} stroke={theme.light} strokeWidth="1" />
      </g>
      <circle cx="30" cy="45" r="3" fill={theme.accent} />

      {/* Corner dots */}
      <g fill={theme.accent}>
        <circle cx="12" cy="13" r="2" />
        <circle cx="48" cy="13" r="2" />
        <circle cx="12" cy="77" r="2" />
        <circle cx="48" cy="77" r="2" />
      </g>
      <g fill={theme.light} opacity="0.7">
        <circle cx="30" cy="10" r="1.5" />
        <circle cx="30" cy="80" r="1.5" />
      </g>
    </svg>
  );
}
