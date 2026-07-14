'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket, getPlayerId } from '../../../hooks/useSocket';
import { useGameStore } from '../../../stores/gameStore';
import { EVENTS } from '../../../lib/socketEvents';
import { ClientGameState, Room } from '../../../lib/types';
import LobbyScreen from '../../../components/lobby/LobbyScreen';
import GameBoard from '../../../components/GameBoard';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const socket = useSocket();
  const code = params.code as string;
  const {
    playerId, playerName, avatarId, setAvatarId, setPlayerName,
    room, setRoom, gameState, setGameState, reset,
  } = useGameStore();
  const [error, setError] = useState('');
  const joinedRef = useRef(false);

  // Set up listeners AND join room in a single effect to avoid race conditions
  useEffect(() => {
    if (!socket || !code) return;

    const pid = getPlayerId();

    const handleRoomJoined = ({ room: r }: { room: Room }) => {
      setRoom(r);
    };

    const handlePlayerJoined = ({ room: r }: { room: Room }) => {
      setRoom(r);
    };

    const handlePlayerLeft = ({ room: r }: { room: Room }) => {
      setRoom(r);
    };

    const handleGameStarted = ({ state, forPlayer }: { state: ClientGameState; forPlayer: string }) => {
      if (forPlayer === pid) {
        setGameState(state);
      }
    };

    const handleStateUpdate = ({ state, forPlayer }: { state: ClientGameState; forPlayer: string }) => {
      if (forPlayer === pid) {
        setGameState(state);
      }
    };

    const handleAvatarUpdated = ({ room: r }: { room: Room }) => {
      setRoom(r);
    };

    const handleNameUpdated = ({ room: r }: { room: Room }) => {
      setRoom(r);
    };

    const handleDisconnected = ({ room: r }: { room: Room }) => {
      setRoom(r);
    };

    const handleError = ({ error: err }: { error: string }) => {
      setError(err);
    };

    // Attach listeners FIRST
    socket.on(EVENTS.ROOM_JOINED, handleRoomJoined);
    socket.on(EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(EVENTS.PLAYER_LEFT, handlePlayerLeft);
    socket.on(EVENTS.GAME_STARTED, handleGameStarted);
    socket.on(EVENTS.STATE_UPDATE, handleStateUpdate);
    socket.on(EVENTS.AVATAR_UPDATED, handleAvatarUpdated);
    socket.on(EVENTS.NAME_UPDATED, handleNameUpdated);
    socket.on(EVENTS.PLAYER_DISCONNECTED, handleDisconnected);
    socket.on(EVENTS.PLAYER_RECONNECTED, handleDisconnected);
    socket.on(EVENTS.ROOM_ERROR, handleError);
    socket.on(EVENTS.GAME_ERROR, handleError);

    // THEN join if we haven't already
    if (!joinedRef.current) {
      joinedRef.current = true;
      const name = playerName || 'Player';
      socket.emit(EVENTS.JOIN_ROOM, {
        code: code.toUpperCase(),
        id: pid,
        name,
        avatarId,
      });
    }

    return () => {
      socket.off(EVENTS.ROOM_JOINED, handleRoomJoined);
      socket.off(EVENTS.PLAYER_JOINED, handlePlayerJoined);
      socket.off(EVENTS.PLAYER_LEFT, handlePlayerLeft);
      socket.off(EVENTS.GAME_STARTED, handleGameStarted);
      socket.off(EVENTS.STATE_UPDATE, handleStateUpdate);
      socket.off(EVENTS.AVATAR_UPDATED, handleAvatarUpdated);
      socket.off(EVENTS.NAME_UPDATED, handleNameUpdated);
      socket.off(EVENTS.PLAYER_DISCONNECTED, handleDisconnected);
      socket.off(EVENTS.PLAYER_RECONNECTED, handleDisconnected);
      socket.off(EVENTS.ROOM_ERROR, handleError);
      socket.off(EVENTS.GAME_ERROR, handleError);
    };
  }, [socket, code, playerName, avatarId, setRoom, setGameState]);

  const handleStart = useCallback(() => {
    socket?.emit(EVENTS.START_GAME, { code });
  }, [socket, code]);

  const handleNameChange = useCallback((newName: string) => {
    setPlayerName(newName);
    socket?.emit(EVENTS.UPDATE_NAME, { code, name: newName });
  }, [socket, code, setPlayerName]);

  const handleAvatarChange = useCallback((newAvatarId: string) => {
    setAvatarId(newAvatarId);
    socket?.emit(EVENTS.UPDATE_AVATAR, { code, avatarId: newAvatarId });
  }, [socket, code, setAvatarId]);

  const handleLeave = useCallback(() => {
    socket?.emit(EVENTS.LEAVE_ROOM);
    joinedRef.current = false;
    reset();
    router.push('/');
  }, [socket, reset, router]);

  const handlePlayCard = useCallback((card: { id: string }) => {
    socket?.emit(EVENTS.PLAY_CARD, { code, cardId: card.id });
  }, [socket, code]);

  const handleDealComplete = useCallback(() => {
    socket?.emit('advance-phase', { code });
  }, [socket, code]);

  const handleRestart = useCallback(() => {
    socket?.emit(EVENTS.START_GAME, { code });
  }, [socket, code]);

  // Error state
  if (error && !room) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#bfe3f7] via-[#dff0fb] to-[#fdf6e9] flex items-center justify-center p-4">
        <div className="panel-soft rounded-3xl p-8 text-center space-y-4">
          <p className="text-coral-dark text-lg font-bold">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="btn-sticker px-6 py-3 bg-teal text-white font-display font-bold rounded-2xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Game in progress
  if (gameState) {
    return (
      <GameBoard
        state={gameState}
        onPlayCard={handlePlayCard}
        onDealComplete={handleDealComplete}
        onRestart={handleRestart}
      />
    );
  }

  // Lobby
  if (room) {
    return (
      <LobbyScreen
        room={room}
        playerId={playerId}
        playerName={playerName || 'Player'}
        avatarId={avatarId}
        onNameChange={handleNameChange}
        onAvatarChange={handleAvatarChange}
        onStart={handleStart}
        onLeave={handleLeave}
      />
    );
  }

  // Loading
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#bfe3f7] via-[#dff0fb] to-[#fdf6e9] flex items-center justify-center">
      <div className="text-ink-soft text-lg font-display font-semibold">Joining room...</div>
    </div>
  );
}
