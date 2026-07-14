import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { registerSocketHandlers } from './src/server/socketHandlers';

/**
 * Standalone Socket.IO server — for deployments where the Next.js frontend
 * is hosted separately (e.g. Vercel) and can't run a custom server.
 * Point the frontend at this with NEXT_PUBLIC_SOCKET_URL.
 */
const port = parseInt(process.env.PORT || '4000', 10);

const httpServer = createServer((req, res) => {
  // Health check endpoint for hosting platforms
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('getaway socket server');
});

const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' },
  pingTimeout: 60000,
});

registerSocketHandlers(io);

httpServer.listen(port, () => {
  console.info(`> Socket server listening on port ${port}`);
});
