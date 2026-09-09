import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env.config';
import { logger } from '../config/logger';

export const initializeSocketIO = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.CORS_ORIGIN, 'http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`⚡ Socket client connected: ${socket.id}`);

    // Join room event (for role/department-based event channels)
    socket.on('join_room', (room: string) => {
      socket.join(room);
      logger.debug(`Socket ${socket.id} joined room: ${room}`);
    });

    // Leave room event
    socket.on('leave_room', (room: string) => {
      socket.leave(room);
      logger.debug(`Socket ${socket.id} left room: ${room}`);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`⚡ Socket client disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};
