'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

let globalSocket: Socket | null = null;

function getSocket(): Socket {
  if (!globalSocket) {
    const options = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    };
    // When the frontend is hosted without the game server (e.g. Vercel),
    // NEXT_PUBLIC_SOCKET_URL points at the standalone socket server.
    // Otherwise connect to the same origin (local dev, single-server deploys).
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    globalSocket = url ? io(url, options) : io(options);
  }
  return globalSocket;
}

export function getPlayerId(): string {
  if (typeof window === 'undefined') return '';
  // sessionStorage is per-tab (localStorage is shared across tabs, which
  // made every tab the same player). Still survives refresh within a tab.
  let id = sessionStorage.getItem('getaway-player-id');
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem('getaway-player-id', id);
  }
  return id;
}

export function useSocket(): Socket | null {
  // On the server, return null. On the client, always return the socket synchronously.
  const socket = useSyncExternalStore(
    // subscribe — no-op since the socket reference never changes
    () => () => {},
    // getSnapshot (client)
    () => getSocket(),
    // getServerSnapshot
    () => null,
  );
  return socket;
}
