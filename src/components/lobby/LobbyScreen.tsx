'use client';

import { useState } from 'react';
import { Room } from '../../lib/types';
import { getAvatar } from '../../lib/avatars';
import { sounds } from '../../lib/sounds';
import Avatar from '../avatars/Avatar';
import AvatarPicker from '../avatars/AvatarPicker';
import RoomCodeDisplay from './RoomCodeDisplay';
import IllustratedBackground from '../landing/IllustratedBackground';

interface LobbyScreenProps {
  room: Room;
  playerId: string;
  playerName: string;
  avatarId: string;
  onNameChange: (name: string) => void;
  onAvatarChange: (avatarId: string) => void;
  onStart: () => void;
  onLeave: () => void;
}

export default function LobbyScreen({ room, playerId, playerName, avatarId, onNameChange, onAvatarChange, onStart, onLeave }: LobbyScreenProps) {
  const isHost = room.hostId === playerId;
  const canStart = room.players.length >= 2 && room.players.length <= 4;
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      onNameChange(trimmed);
    }
    setEditingName(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <IllustratedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
              Getaway
            </h1>
            <p className="text-ink-soft text-sm font-medium">Waiting for players...</p>
          </div>

          {/* Room code */}
          <div className="panel-soft rounded-3xl p-5">
            <RoomCodeDisplay code={room.code} />
          </div>

          {/* Your profile */}
          <div className="panel-soft rounded-3xl p-5 space-y-4">
            <p className="text-ink-soft text-xs font-bold uppercase tracking-wider">Your character</p>
            <div className="flex items-center gap-3">
              <Avatar avatarId={avatarId} size="md" />
              {editingName ? (
                <form onSubmit={e => { e.preventDefault(); handleNameSubmit(); }} className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    autoFocus
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white border-2 border-ink/10 text-ink font-semibold placeholder:text-ink/30 focus:outline-none focus:border-teal"
                    placeholder="Your name"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-teal text-white rounded-xl text-sm font-bold hover:bg-teal-dark transition-colors"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-ink font-bold">{playerName || 'Player'}</span>
                  <button
                    onClick={() => { setNameInput(playerName); setEditingName(true); }}
                    className="text-xs font-semibold text-ink-soft hover:text-ink transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            <AvatarPicker selected={avatarId} onSelect={onAvatarChange} />
          </div>

          {/* Players list */}
          <div className="panel-soft rounded-3xl p-5">
            <p className="text-ink-soft text-xs font-bold uppercase tracking-wider mb-3">
              Players ({room.players.length}/4)
            </p>
            <div className="space-y-2.5">
              {room.players.map((player) => (
                <div key={player.id} className="flex items-center gap-3 bg-white/70 rounded-2xl px-3 py-2">
                  <Avatar avatarId={player.avatarId} size="sm" isDisconnected={!player.isConnected} />
                  <div className="flex-1">
                    <span className="text-ink font-bold text-sm">{player.name}</span>
                    <span className="block text-[11px] text-ink-soft">{getAvatar(player.avatarId).name}</span>
                  </div>
                  {player.isHost && (
                    <span className="text-xs font-bold text-amber-600 bg-sunny/30 px-2.5 py-1 rounded-full">
                      Host
                    </span>
                  )}
                  {!player.isConnected && (
                    <span className="text-xs font-bold text-coral-dark bg-coral/10 px-2.5 py-1 rounded-full">
                      Offline
                    </span>
                  )}
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 4 - room.players.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 px-3 py-2 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-ink/5 border-2 border-dashed border-ink/20" />
                  <span className="text-ink-soft text-sm font-medium">Waiting for a friend...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {isHost ? (
              <button
                onClick={() => { sounds.click(); onStart(); }}
                disabled={!canStart}
                className={`btn-sticker w-full py-4 font-display font-bold text-xl rounded-2xl ${
                  canStart
                    ? 'bg-coral text-white'
                    : 'bg-ink/10 text-ink/30 cursor-not-allowed'
                }`}
              >
                {canStart ? 'Start Game' : `Need ${2 - room.players.length} more player${room.players.length === 1 ? '' : 's'}`}
              </button>
            ) : (
              <div className="text-center py-3 text-ink-soft text-sm font-medium">
                Waiting for the host to start the game...
              </div>
            )}
            <button
              onClick={onLeave}
              className="w-full py-2.5 text-coral-dark/80 hover:text-coral-dark text-sm font-bold transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
