import { create } from 'zustand';
import { ClientGameState, Room, PlayerInfo } from '../lib/types';

interface GameStore {
  // Connection
  playerId: string;
  playerName: string;
  avatarId: string;
  isConnected: boolean;

  // Room
  room: Room | null;
  roomCode: string | null;

  // Game
  gameState: ClientGameState | null;

  // Actions
  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  setAvatarId: (id: string) => void;
  setConnected: (connected: boolean) => void;
  setRoom: (room: Room | null) => void;
  setRoomCode: (code: string | null) => void;
  setGameState: (state: ClientGameState | null) => void;
  updateRoom: (room: Room) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  playerId: '',
  playerName: '',
  avatarId: 'cat',
  isConnected: false,

  room: null,
  roomCode: null,

  gameState: null,

  setPlayerId: (id) => set({ playerId: id }),
  setPlayerName: (name) => set({ playerName: name }),
  setAvatarId: (id) => set({ avatarId: id }),
  setConnected: (connected) => set({ isConnected: connected }),
  setRoom: (room) => set({ room, roomCode: room?.code || null }),
  setRoomCode: (code) => set({ roomCode: code }),
  setGameState: (state) => set({ gameState: state }),
  updateRoom: (room) => set({ room }),
  reset: () => set({ room: null, roomCode: null, gameState: null }),
}));
