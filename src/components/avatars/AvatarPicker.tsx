'use client';

import { AVATARS } from '../../lib/avatars';
import CharacterArt from './CharacterArt';

interface AvatarPickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {AVATARS.map(character => {
        const isSelected = selected === character.id;
        return (
          <button
            key={character.id}
            onClick={() => onSelect(character.id)}
            className={`group flex flex-col items-center gap-1 p-1.5 rounded-2xl transition-all ${
              isSelected
                ? 'bg-white ring-2 ring-coral shadow-md scale-105'
                : 'hover:bg-white/70 hover:scale-105'
            }`}
          >
            <div className={`w-full aspect-square rounded-xl overflow-hidden border-2 ${
              isSelected ? 'border-coral' : 'border-ink/10'
            }`}>
              <CharacterArt character={character} className="w-full h-full" />
            </div>
            <span className={`text-[11px] font-semibold ${
              isSelected ? 'text-coral' : 'text-ink-soft'
            }`}>
              {character.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
