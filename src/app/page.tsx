'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket, getPlayerId } from '../hooks/useSocket';
import { useGameStore } from '../stores/gameStore';
import { EVENTS } from '../lib/socketEvents';
import { Room } from '../lib/types';
import { getAvatar } from '../lib/avatars';
import { sounds } from '../lib/sounds';
import AvatarPicker from '../components/avatars/AvatarPicker';
import CharacterArt from '../components/avatars/CharacterArt';
import CardBack from '../components/cards/CardBack';
import IllustratedBackground from '../components/landing/IllustratedBackground';

export default function Home() {
  const router = useRouter();
  const socket = useSocket();
  const { playerName, setPlayerName, avatarId, setAvatarId, setPlayerId, setRoom } = useGameStore();
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'menu' | 'join'>('menu');
  const [error, setError] = useState('');
  const [name, setName] = useState(playerName || '');

  const character = getAvatar(avatarId);

  useEffect(() => {
    const id = getPlayerId();
    setPlayerId(id);
  }, [setPlayerId]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = ({ room }: { room: Room }) => {
      setRoom(room);
      router.push(`/room/${room.code}`);
    };

    const handleRoomJoined = ({ room }: { room: Room }) => {
      setRoom(room);
      router.push(`/room/${room.code}`);
    };

    const handleError = ({ error }: { error: string }) => {
      setError(error);
    };

    socket.on(EVENTS.ROOM_CREATED, handleRoomCreated);
    socket.on(EVENTS.ROOM_JOINED, handleRoomJoined);
    socket.on(EVENTS.ROOM_ERROR, handleError);

    return () => {
      socket.off(EVENTS.ROOM_CREATED, handleRoomCreated);
      socket.off(EVENTS.ROOM_JOINED, handleRoomJoined);
      socket.off(EVENTS.ROOM_ERROR, handleError);
    };
  }, [socket, router, setRoom]);

  const handleCreateRoom = () => {
    if (!socket) return;
    sounds.click();
    const finalName = name.trim() || 'Player';
    setPlayerName(finalName);
    socket.emit(EVENTS.CREATE_ROOM, {
      id: getPlayerId(),
      name: finalName,
      avatarId,
    });
  };

  const handleJoinRoom = () => {
    if (!socket || !joinCode.trim()) return;
    sounds.click();
    const finalName = name.trim() || 'Player';
    setPlayerName(finalName);
    socket.emit(EVENTS.JOIN_ROOM, {
      code: joinCode.trim().toUpperCase(),
      id: getPlayerId(),
      name: finalName,
      avatarId,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <IllustratedBackground />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center lg:items-stretch">
        {/* Left: menu */}
        <div className="w-full lg:w-[440px] shrink-0 flex flex-col justify-center gap-6 px-8 py-12 lg:pl-16">
          <div>
            <h1 className="font-display text-6xl lg:text-7xl font-bold text-ink drop-shadow-[0_3px_0_rgba(255,255,255,0.8)]">
              Getaway
            </h1>
            <p className="text-ink-soft font-medium mt-1">
              Shed your cards. Don&apos;t get caught holding them.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5">
              Your name
            </label>
            <input
              type="text"
              placeholder="Player"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl bg-white/90 border-2 border-ink/10 text-ink font-semibold placeholder:text-ink/30 focus:outline-none focus:border-teal shadow-sm"
            />
          </div>

          {error && (
            <div className="text-coral-dark text-sm font-semibold bg-coral/10 border-2 border-coral/30 rounded-2xl px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Menu actions */}
          {mode === 'menu' ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateRoom}
                className="btn-sticker w-full py-4 bg-coral text-white font-display font-bold text-xl rounded-2xl"
              >
                New Game
              </button>
              <button
                onClick={() => setMode('join')}
                className="btn-sticker w-full py-4 bg-teal text-white font-display font-bold text-xl rounded-2xl"
              >
                Join Game
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="ROOM CODE"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                autoFocus
                className="w-full px-4 py-4 rounded-2xl bg-white/90 border-2 border-ink/10 text-ink text-center text-3xl font-mono font-bold tracking-[0.3em] placeholder:text-ink/25 placeholder:text-base placeholder:tracking-widest focus:outline-none focus:border-teal shadow-sm"
              />
              <button
                onClick={handleJoinRoom}
                disabled={joinCode.trim().length < 6}
                className={`btn-sticker w-full py-4 font-display font-bold text-xl rounded-2xl ${
                  joinCode.trim().length >= 6
                    ? 'bg-teal text-white'
                    : 'bg-ink/10 text-ink/30 cursor-not-allowed'
                }`}
              >
                Join Game
              </button>
              <button
                onClick={() => { setMode('menu'); setError(''); }}
                className="w-full py-2 text-ink-soft text-sm font-semibold hover:text-ink transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Signature deck preview */}
          <div className="panel-soft rounded-2xl p-4 flex items-center gap-4">
            <motion.div
              key={character.id}
              initial={{ rotate: -12, scale: 0.8, opacity: 0 }}
              animate={{ rotate: -6, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CardBack avatarId={character.id} />
            </motion.div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
                Signature deck
              </p>
              <p className="text-sm text-ink font-medium">
                {character.name} plays with their own card skin — pick a character, get their deck.
              </p>
            </div>
          </div>
        </div>

        {/* Right: character showcase + picker */}
        <div className="flex-1 flex items-center justify-center px-8 pb-16 lg:pb-0">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Big preview of selected character */}
            <div className="flex flex-col items-center gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 16, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="w-52 h-52 lg:w-64 lg:h-64 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl rotate-2"
                >
                  <CharacterArt character={character} className="w-full h-full" />
                </motion.div>
              </AnimatePresence>
              <div className="bg-white/90 border-2 border-ink/10 rounded-full px-6 py-1.5 shadow-md -rotate-1">
                <span className="font-display font-bold text-lg text-ink">{character.name}</span>
              </div>
            </div>

            {/* Picker */}
            <div className="panel-soft rounded-3xl p-4 w-72">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
                Choose your character
              </p>
              <AvatarPicker selected={avatarId} onSelect={setAvatarId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
