import { Server, Socket } from 'socket.io';
import { EVENTS } from '../lib/socketEvents';
import { filterStateForPlayer } from './stateFilter';
import * as RoomManager from './RoomManager';

export function registerSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    let playerId: string = '';

    socket.on(EVENTS.CREATE_ROOM, ({ id, name, avatarId }: { id: string; name: string; avatarId: string }) => {
      playerId = id;
      const room = RoomManager.createRoom(id, name, avatarId);
      socket.join(room.code);
      socket.emit(EVENTS.ROOM_CREATED, { room });
    });

    socket.on(EVENTS.JOIN_ROOM, ({ code, id, name, avatarId }: { code: string; id: string; name: string; avatarId: string }) => {
      playerId = id;
      const { room, error } = RoomManager.joinRoom(code, id, name, avatarId);
      if (error) {
        socket.emit(EVENTS.ROOM_ERROR, { error });
        return;
      }
      socket.join(code);
      socket.emit(EVENTS.ROOM_JOINED, { room });

      // If there's an active game, send the current state
      if (room.gameState) {
        const playerIndex = room.players.findIndex(p => p.id === id);
        if (playerIndex !== -1) {
          const clientState = filterStateForPlayer(room.gameState, playerIndex);
          socket.emit(EVENTS.STATE_UPDATE, { state: clientState });
        }
      }

      socket.to(code).emit(EVENTS.PLAYER_JOINED, {
        player: room.players.find(p => p.id === id),
        room,
      });
    });

    socket.on(EVENTS.START_GAME, ({ code }: { code: string }) => {
      const { state, error } = RoomManager.startGame(code, playerId);
      if (error || !state) {
        socket.emit(EVENTS.GAME_ERROR, { error });
        return;
      }

      const room = RoomManager.getRoom(code);
      if (!room) return;

      // Send filtered state to each player
      room.players.forEach((p, i) => {
        const clientState = filterStateForPlayer(state, i);
        io.to(code).emit(EVENTS.GAME_STARTED, { state: clientState, forPlayer: p.id });
      });
    });

    socket.on(EVENTS.PLAY_CARD, ({ code, cardId }: { code: string; cardId: string }) => {
      const { state, error } = RoomManager.handlePlayCard(code, playerId, cardId);
      if (error || !state) {
        socket.emit(EVENTS.GAME_ERROR, { error });
        return;
      }

      broadcastState(io, code);
      scheduleTrickAdvance(io, code);
    });

    socket.on(EVENTS.UPDATE_AVATAR, ({ code, avatarId }: { code: string; avatarId: string }) => {
      const room = RoomManager.updateAvatar(code, playerId, avatarId);
      if (room) {
        io.to(code).emit(EVENTS.AVATAR_UPDATED, { room });
      }
    });

    socket.on(EVENTS.UPDATE_NAME, ({ code, name }: { code: string; name: string }) => {
      const room = RoomManager.updateName(code, playerId, name);
      if (room) {
        io.to(code).emit(EVENTS.NAME_UPDATED, { room });
      }
    });

    socket.on(EVENTS.LEAVE_ROOM, () => {
      const result = RoomManager.leaveRoom(playerId);
      if (result) {
        socket.leave(result.room.code);
        io.to(result.room.code).emit(EVENTS.PLAYER_LEFT, {
          player: result.playerInfo,
          room: result.room,
        });
      }
    });

    socket.on('disconnect', () => {
      const result = RoomManager.handleDisconnect(playerId);
      if (result) {
        io.to(result.room.code).emit(EVENTS.PLAYER_DISCONNECTED, {
          player: result.playerInfo,
          room: result.room,
        });
      }
    });

    // Handle phase advancement (dealing -> playing, trick-result -> playing)
    socket.on('advance-phase', ({ code }: { code: string }) => {
      const state = RoomManager.advancePhase(code);
      if (state) {
        broadcastState(io, code);
      }
    });
  });
}

const trickTimers = new Map<string, NodeJS.Timeout>();

// A resolved trick parks the game in 'trick-result' so players can see the
// outcome; the server owns moving it back to 'playing'.
function scheduleTrickAdvance(io: Server, code: string) {
  const room = RoomManager.getRoom(code);
  if (!room?.gameState || room.gameState.phase !== 'trick-result') return;

  const existing = trickTimers.get(code);
  if (existing) clearTimeout(existing);

  trickTimers.set(code, setTimeout(() => {
    trickTimers.delete(code);
    const state = RoomManager.advancePhase(code);
    if (state) broadcastState(io, code);
  }, 2200));
}

function broadcastState(io: Server, code: string) {
  const room = RoomManager.getRoom(code);
  if (!room || !room.gameState) return;

  room.players.forEach((p, i) => {
    const clientState = filterStateForPlayer(room.gameState!, i);
    // Send to all sockets in room, each gets their own filtered view
    io.to(code).emit(EVENTS.STATE_UPDATE, { state: clientState, forPlayer: p.id });
  });
}
