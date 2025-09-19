// src/sockets/index.ts
import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { env } from '@config/env';

// Singleton socket.io instance
let io: Server | null = null;

// Map userId -> Set<socketId>
const userSockets = new Map<string, Set<string>>();
// Map socketId -> userId
const socketToUser = new Map<string, string>();

interface AuthJoinPayload {
  userId: string;
  token?: string | null;
}

/**
 * Initialize Socket.IO and attach to HTTP server.
 */
export const initSocket = (server: http.Server): Server => {
  if (io) {
    throw new Error('Socket.io already initialized. Call initSocket(server) first.');
  }

  const allowedOrigins = [env.CLIENT_URL || '*'];

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin ?? '')) {
          return callback(null, true);
        }

        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000
  });

  // Handshake middleware: try to verify token if present
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      // permit connection (client may auth later via auth:join)
      return next();
    }

    try {
      const secret = env.JWT_ACCESS_SECRET;
      const decoded = jwt.verify(token, secret) as { sub: string };
      socket.data.userId = decoded.sub;
      return next();
    } catch (err: any) {
      return next(err);
    }
  });

  io.on('connection', (socket) => {
    socket.on('error', (err) => {
      console.error(`Socket error (${socket.id}):`, err);
    });

    /**
     * auth:join
     * Client should call after connect to claim room membership:
     * socket.emit('auth:join', { userId, token })
     */
    socket.on('auth:join', ({ userId, token }: AuthJoinPayload) => {
      try {
        if (token) {
          try {
            const secret = env.JWT_ACCESS_SECRET;
            const decoded = jwt.verify(token, secret) as { sub: string };
            if (decoded.sub !== userId) {
              return socket.emit('auth:joined', { success: false, message: 'Token subject mismatch' });
            }
          } catch (err) {
            return socket.emit('auth:joined', { success: false, message: 'Invalid token' });
          }
        }

        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
          return socket.emit('auth:joined', { success: false, message: 'Invalid userId' });
        }

        if (!userSockets.has(userId)) userSockets.set(userId, new Set());
        userSockets.get(userId)!.add(socket.id);
        socketToUser.set(socket.id, userId);

        socket.join(`user:${userId}`);
        socket.emit('auth:joined', { success: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        socket.emit('auth:joined', { success: false, message });
      }
    });

    // Clean up on disconnect
    socket.on('disconnect', (reason) => {
      const userId = socketToUser.get(socket.id);
      if (userId) {
        const set = userSockets.get(userId);
        if (set) {
          set.delete(socket.id);
          if (set.size === 0) userSockets.delete(userId);
        }
        socketToUser.delete(socket.id);
      }
    });
  });

  return io;
};

/** Return the singleton io instance. */
export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  }

  return io;
};

/** Emit to a specific user's room (user:{userId}) */
export const emitToUser = (userId: string, event: string, data: unknown): void => {
  const socketio = getIO();
  socketio.to(`user:${userId}`).emit(event, data);
};

/** Broadcast to all connected clients */
export const broadcast = (event: string, data: unknown) => {
  getIO().emit(event, data);
};
