import { customAlphabet } from 'nanoid';
import { Room, PlayerInfo, GameState, Card } from '../lib/types';
import { initializeGame, playCard, getPlayableCards } from '../lib/gameLogic';

const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

const rooms = new Map<string, Room>();
const playerRooms = new Map<string, string>(); // playerId -> roomCode
const disconnectTimers = new Map<string, NodeJS.Timeout>();

export function createRoom(playerId: string, playerName: string, avatarId: string): Room {
  const code = generateCode();
  const room: Room = {
    code,
    players: [{
      id: playerId,
      name: playerName,
      avatarId,
      isHost: true,
      isConnected: true,
    }],
    hostId: playerId,
    gameState: null,
    status: 'lobby',
  };
  rooms.set(code, room);
  playerRooms.set(playerId, code);
  return room;
}

export function joinRoom(
  code: string,
  playerId: string,
  playerName: string,
  avatarId: string
): { room: Room; error?: string } {
  const room = rooms.get(code);
  if (!room) return { room: null!, error: 'Room not found' };
  if (room.status !== 'lobby') return { room: null!, error: 'Game already in progress' };
  if (room.players.length >= 4) return { room: null!, error: 'Room is full' };

  // Check if player is reconnecting
  const existing = room.players.find(p => p.id === playerId);
  if (existing) {
    existing.isConnected = true;
    existing.name = playerName;
    existing.avatarId = avatarId;
    clearDisconnectTimer(playerId);
    playerRooms.set(playerId, code);
    return { room };
  }

  room.players.push({
    id: playerId,
    name: playerName,
    avatarId,
    isHost: false,
    isConnected: true,
  });
  playerRooms.set(playerId, code);
  return { room };
}

export function startGame(code: string, playerId: string): { state: GameState | null; error?: string } {
  const room = rooms.get(code);
  if (!room) return { state: null, error: 'Room not found' };
  // Initial start is host-only; once a game has finished, anyone can restart
  const isRestart = room.gameState?.phase === 'game-over';
  if (!isRestart && room.hostId !== playerId) return { state: null, error: 'Only host can start' };
  if (room.players.length < 2) return { state: null, error: 'Need at least 2 players' };

  const names = room.players.map(p => p.name);
  const avatarIds = room.players.map(p => p.avatarId);
  const state = initializeGame(names, avatarIds);
  room.gameState = state;
  room.status = 'playing';
  return { state };
}

export function handlePlayCard(
  code: string,
  playerId: string,
  cardId: string
): { state: GameState | null; error?: string } {
  const room = rooms.get(code);
  if (!room || !room.gameState) return { state: null, error: 'No active game' };

  const playerIndex = room.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return { state: null, error: 'Player not in room' };
  if (playerIndex !== room.gameState.currentPlayerIndex) {
    return { state: null, error: 'Not your turn' };
  }

  const player = room.gameState.players[playerIndex];
  const card = player.hand.find(c => c.id === cardId);
  if (!card) return { state: null, error: 'Card not in hand' };

  const playable = getPlayableCards(player.hand, room.gameState.leadSuit, room.gameState.isFirstTrick);
  if (!playable.some(c => c.id === cardId)) {
    return { state: null, error: 'Illegal card' };
  }

  room.gameState = playCard(room.gameState, card);
  return { state: room.gameState };
}

export function advancePhase(code: string): GameState | null {
  const room = rooms.get(code);
  if (!room || !room.gameState) return null;

  if (room.gameState.phase === 'dealing') {
    room.gameState.phase = 'playing';
  } else if (room.gameState.phase === 'trick-result') {
    room.gameState.phase = 'playing';
  }

  if (room.gameState.phase === 'game-over') {
    room.status = 'finished';
  }

  return room.gameState;
}

export function updateAvatar(code: string, playerId: string, avatarId: string): Room | null {
  const room = rooms.get(code);
  if (!room) return null;
  const player = room.players.find(p => p.id === playerId);
  if (player) player.avatarId = avatarId;
  return room;
}

export function updateName(code: string, playerId: string, name: string): Room | null {
  const room = rooms.get(code);
  if (!room) return null;
  const player = room.players.find(p => p.id === playerId);
  if (player) player.name = name;
  return room;
}

export function handleDisconnect(playerId: string): { room: Room; playerInfo: PlayerInfo } | null {
  const code = playerRooms.get(playerId);
  if (!code) return null;
  const room = rooms.get(code);
  if (!room) return null;

  const player = room.players.find(p => p.id === playerId);
  if (!player) return null;

  player.isConnected = false;

  // Set 60s reconnection timer
  const timer = setTimeout(() => {
    removePlayer(code, playerId);
  }, 60000);
  disconnectTimers.set(playerId, timer);

  return { room, playerInfo: player };
}

export function handleReconnect(playerId: string): Room | null {
  clearDisconnectTimer(playerId);
  const code = playerRooms.get(playerId);
  if (!code) return null;
  const room = rooms.get(code);
  if (!room) return null;

  const player = room.players.find(p => p.id === playerId);
  if (player) player.isConnected = true;
  return room;
}

function removePlayer(code: string, playerId: string) {
  const room = rooms.get(code);
  if (!room) return;

  room.players = room.players.filter(p => p.id !== playerId);
  playerRooms.delete(playerId);

  if (room.players.length === 0) {
    rooms.delete(code);
    return;
  }

  // Transfer host if needed
  if (room.hostId === playerId) {
    room.hostId = room.players[0].id;
    room.players[0].isHost = true;
  }
}

function clearDisconnectTimer(playerId: string) {
  const timer = disconnectTimers.get(playerId);
  if (timer) {
    clearTimeout(timer);
    disconnectTimers.delete(playerId);
  }
}

export function leaveRoom(playerId: string): { room: Room; playerInfo: PlayerInfo } | null {
  const code = playerRooms.get(playerId);
  if (!code) return null;
  const room = rooms.get(code);
  if (!room) return null;

  const player = room.players.find(p => p.id === playerId);
  if (!player) return null;

  clearDisconnectTimer(playerId);
  removePlayer(code, playerId);
  return { room, playerInfo: player };
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

export function getPlayerRoom(playerId: string): string | undefined {
  return playerRooms.get(playerId);
}
