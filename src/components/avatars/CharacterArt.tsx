'use client';

import { AvatarDef } from '../../lib/avatars';

interface CharacterArtProps {
  character: AvatarDef;
  className?: string;
}

/**
 * 2D anime-style vector bust, drawn programmatically so every character
 * shares proportions while hairstyle/palette give identity.
 * Layer order: bg → back hair → torso → neck → head → front hair → face → accents.
 */
export default function CharacterArt({ character: c, className }: CharacterArtProps) {
  const gradId = `bg-${c.id}`;

  return (
    <svg viewBox="0 0 120 120" className={className} aria-label={c.name} role="img">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.bgFrom} />
          <stop offset="100%" stopColor={c.bgTo} />
        </linearGradient>
      </defs>

      <rect width="120" height="120" fill={`url(#${gradId})`} />

      {backHair(c)}

      {/* Torso / shirt */}
      <path
        d="M 20 122 Q 22 96 44 90 Q 52 100 60 100 Q 68 100 76 90 Q 98 96 100 122 Z"
        fill={c.shirtColor}
      />
      {/* Collar shading */}
      <path d="M 48 91 Q 60 102 72 91 Q 68 98 60 98 Q 52 98 48 91 Z" fill="rgba(43,58,74,0.14)" />

      {/* Neck */}
      <path d="M 53 74 L 53 92 Q 60 97 67 92 L 67 74 Z" fill={c.skinTone} />
      <path d="M 53 74 Q 60 82 67 74 L 67 80 Q 60 86 53 80 Z" fill="rgba(43,58,74,0.10)" />

      {/* Ears */}
      <ellipse cx="37.5" cy="57" rx="4" ry="6" fill={c.skinTone} />
      <ellipse cx="82.5" cy="57" rx="4" ry="6" fill={c.skinTone} />

      {/* Head */}
      <path
        d="M 38 52 Q 38 28 60 28 Q 82 28 82 52 Q 82 66 73 75 Q 66 82 60 82 Q 54 82 47 75 Q 38 66 38 52 Z"
        fill={c.skinTone}
      />

      {frontHair(c)}

      {face(c)}

      {accessories(c)}
    </svg>
  );
}

/* ---------- face ---------- */

function face(c: AvatarDef) {
  const female = c.gender === 'female';
  const eyeRy = female ? 6.2 : 5.2;
  const lashW = female ? 2.2 : 1.7;

  const eye = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy="58.5" rx="5" ry={eyeRy} fill="#ffffff" />
      <circle cx={cx} cy="59" r="3.6" fill={c.eyeColor} />
      <circle cx={cx} cy="59.6" r="1.7" fill="#22293a" />
      <circle cx={cx - 1.3} cy="56.6" r="1.3" fill="#ffffff" />
      {/* upper lash line */}
      <path
        d={`M ${cx - 5.5} ${female ? 54 : 55} Q ${cx} ${female ? 50.5 : 52} ${cx + 5.5} ${female ? 54 : 55}`}
        stroke="#2b3a4a"
        strokeWidth={lashW}
        strokeLinecap="round"
        fill="none"
      />
      {female && (
        <path
          d={`M ${cx + 5.2} 54 L ${cx + 7} 52.6`}
          stroke="#2b3a4a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </g>
  );

  return (
    <g>
      {eye(50)}
      {eye(70)}
      {/* brows */}
      <path
        d={female ? 'M 45 48 Q 50 46 55 47.5' : 'M 44.5 48 Q 50 46.5 55.5 47.5'}
        stroke={c.hairShade}
        strokeWidth={female ? 1.8 : 2.4}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={female ? 'M 65 47.5 Q 70 46 75 48' : 'M 64.5 47.5 Q 70 46.5 75.5 48'}
        stroke={c.hairShade}
        strokeWidth={female ? 1.8 : 2.4}
        strokeLinecap="round"
        fill="none"
      />
      {/* nose */}
      <path d="M 60.5 63 L 61.8 65.2" stroke="rgba(43,58,74,0.25)" strokeWidth="1.2" strokeLinecap="round" />
      {/* mouth */}
      <path d="M 55.5 70.5 Q 60 74 64.5 70.5" stroke="#c05a6e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* blush */}
      <ellipse cx="45" cy="65.5" rx="3.6" ry="2" fill="#ff9d9d" opacity={female ? 0.55 : 0.35} />
      <ellipse cx="75" cy="65.5" rx="3.6" ry="2" fill="#ff9d9d" opacity={female ? 0.55 : 0.35} />
    </g>
  );
}

/* ---------- hair: back layer (behind head) ---------- */

function backHair(c: AvatarDef) {
  switch (c.hairstyle) {
    case 'long':
      return (
        <path
          d="M 28 60 Q 22 14 60 12 Q 98 14 92 60 Q 96 88 88 108 Q 83 96 80 86 Q 82 70 80 58 L 40 58 Q 38 70 40 86 Q 37 96 32 108 Q 24 88 28 60 Z"
          fill={c.hairShade}
        />
      );
    case 'twintails':
      return (
        <g fill={c.hairShade}>
          <path d="M 32 58 Q 26 16 60 14 Q 94 16 88 58 Q 86 64 84 62 L 36 62 Q 34 64 32 58 Z" />
          <path d="M 30 44 Q 12 52 16 84 Q 18 98 24 104 Q 22 84 28 68 Q 32 54 30 44 Z" />
          <path d="M 90 44 Q 108 52 104 84 Q 102 98 96 104 Q 98 84 92 68 Q 88 54 90 44 Z" />
        </g>
      );
    case 'bob':
      return (
        <path
          d="M 30 60 Q 24 14 60 12 Q 96 14 90 60 Q 92 74 84 80 Q 86 66 84 58 L 36 58 Q 34 66 36 80 Q 28 74 30 60 Z"
          fill={c.hairShade}
        />
      );
    case 'ponytail':
      return (
        <g fill={c.hairShade}>
          <path d="M 32 58 Q 26 16 60 14 Q 94 16 88 58 Q 86 62 84 60 L 36 60 Q 34 62 32 58 Z" />
          <path d="M 88 34 Q 104 40 102 66 Q 100 88 92 100 Q 94 78 88 62 Q 84 46 88 34 Z" />
        </g>
      );
    case 'curly':
      return (
        <g fill={c.hairShade}>
          <circle cx="34" cy="56" r="6.5" />
          <circle cx="86" cy="56" r="6.5" />
        </g>
      );
    default:
      return null;
  }
}

/* ---------- hair: front layer (over forehead) ---------- */

function frontHair(c: AvatarDef) {
  const shine = (
    <path
      d="M 42 26 Q 52 20 64 21"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  );

  switch (c.hairstyle) {
    case 'long':
      return (
        <g>
          <path
            d="M 34 58 Q 28 20 60 17 Q 92 20 86 58 Q 84 60 82 58 Q 80 42 66 54 Q 60 36 46 52 Q 40 44 38 58 Q 36 60 34 58 Z"
            fill={c.hairColor}
          />
          {shine}
        </g>
      );
    case 'twintails':
      return (
        <g>
          <path
            d="M 36 56 Q 32 20 60 17 Q 88 20 84 56 L 78 46 L 72 55 L 66 44 L 60 55 L 54 44 L 48 55 L 42 46 Z"
            fill={c.hairColor}
          />
          {shine}
        </g>
      );
    case 'bob':
      return (
        <g>
          <path
            d="M 34 58 Q 28 20 60 17 Q 92 20 86 58 Q 84 60 82 58 Q 80 40 71 52 Q 62 38 53 52 Q 45 41 38 58 Q 36 60 34 58 Z"
            fill={c.hairColor}
          />
          {shine}
        </g>
      );
    case 'ponytail':
      return (
        <g>
          <path
            d="M 34 58 Q 28 20 60 17 Q 92 20 86 58 Q 84 60 82 58 Q 80 42 66 54 Q 60 36 46 52 Q 40 44 38 58 Q 36 60 34 58 Z"
            fill={c.hairColor}
          />
          {shine}
        </g>
      );
    case 'spiky':
      return (
        <path
          d="M 32 56 L 26 36 L 38 40 L 36 22 L 48 32 L 54 14 L 62 30 L 74 16 L 76 32 L 90 24 L 86 42 L 96 40 L 88 58 Q 86 60 84 56 Q 80 42 70 52 L 64 40 L 56 52 L 48 40 L 40 56 Q 36 60 32 56 Z"
          fill={c.hairColor}
        />
      );
    case 'messy':
      return (
        <g fill={c.hairColor}>
          <path d="M 34 58 Q 28 20 60 17 Q 92 20 86 58 Q 84 60 82 58 Q 82 40 70 53 Q 66 36 52 52 Q 44 40 38 58 Q 36 60 34 58 Z" />
          <path d="M 30 44 L 21 37 L 31 51 Z" />
          <path d="M 90 44 L 99 37 L 89 51 Z" />
          <path d="M 56 17 L 60 8 L 65 17 Z" />
        </g>
      );
    case 'undercut':
      return (
        <g>
          {/* shaved sides */}
          <path d="M 36 50 Q 34 58 38 64 L 41 62 Q 38 56 39.5 50 Z" fill={c.hairShade} opacity="0.55" />
          <path d="M 84 50 Q 86 58 82 64 L 79 62 Q 82 56 80.5 50 Z" fill={c.hairShade} opacity="0.55" />
          <path
            d="M 36 50 Q 32 22 60 20 Q 88 22 84 50 Q 82 52 80 49 Q 74 38 64 47 Q 56 34 46 47 Q 40 40 38 50 Q 37 52 36 50 Z"
            fill={c.hairColor}
          />
          {shine}
        </g>
      );
    case 'curly':
      return (
        <g fill={c.hairColor}>
          <path d="M 34 56 Q 28 22 60 19 Q 92 22 86 56 Q 84 58 82 55 Q 78 42 69 51 Q 61 38 52 51 Q 45 42 38 56 Q 36 58 34 56 Z" />
          <circle cx="40" cy="30" r="7.5" />
          <circle cx="52" cy="23" r="8" />
          <circle cx="66" cy="22" r="8" />
          <circle cx="79" cy="29" r="7.5" />
          <circle cx="86" cy="42" r="6.5" />
          <circle cx="34" cy="42" r="6.5" />
        </g>
      );
  }
}

/* ---------- accessories ---------- */

function accessories(c: AvatarDef) {
  switch (c.hairstyle) {
    case 'twintails':
      return (
        <g fill={c.accentColor}>
          <circle cx="30" cy="45" r="3.5" />
          <circle cx="90" cy="45" r="3.5" />
        </g>
      );
    case 'ponytail':
      return <circle cx="88" cy="37" r="3.5" fill={c.accentColor} />;
    case 'bob':
      return (
        <g fill={c.accentColor}>
          <rect x="73" y="43" width="9" height="2.6" rx="1.3" transform="rotate(-24 77.5 44.3)" />
          <rect x="73" y="47.5" width="9" height="2.6" rx="1.3" transform="rotate(-24 77.5 48.8)" />
        </g>
      );
    default:
      return null;
  }
}
