'use client';

import { useState } from 'react';
import { isMuted, setMuted, sounds } from '../lib/sounds';

export default function SoundToggle() {
  // Only rendered client-side (game state arrives via socket), so reading
  // the saved preference in the initializer is safe.
  const [muted, setMutedState] = useState(() => isMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sounds.click();
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      className="bg-white/80 backdrop-blur-sm border-2 border-ink/10 rounded-full w-10 h-10 flex items-center justify-center shadow-md text-lg hover:scale-105 transition-transform"
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
