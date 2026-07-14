export const EVENTS = {
  // Client -> Server
  CREATE_ROOM: 'create-room',
  JOIN_ROOM: 'join-room',
  START_GAME: 'start-game',
  PLAY_CARD: 'play-card',
  LEAVE_ROOM: 'leave-room',
  UPDATE_AVATAR: 'update-avatar',
  UPDATE_NAME: 'update-name',

  // Server -> Client
  ROOM_CREATED: 'room-created',
  ROOM_JOINED: 'room-joined',
  PLAYER_JOINED: 'player-joined',
  PLAYER_LEFT: 'player-left',
  GAME_STARTED: 'game-started',
  STATE_UPDATE: 'state-update',
  GAME_ERROR: 'game-error',
  PLAYER_DISCONNECTED: 'player-disconnected',
  PLAYER_RECONNECTED: 'player-reconnected',
  ROOM_ERROR: 'room-error',
  AVATAR_UPDATED: 'avatar-updated',
  NAME_UPDATED: 'name-updated',
} as const;
