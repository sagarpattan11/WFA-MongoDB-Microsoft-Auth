import http from 'http';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env.config';
import { logger } from './config/logger';
import { seedDatabase } from './scripts/seed';
import { initializeSocketIO } from './sockets/socket.server';

const startServer = async (): Promise<void> => {
  // 1. Connect to MongoDB
  await connectDatabase();

  // 2. Seed initial data if DB is empty
  await seedDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);

  // 3. Initialize Socket.IO
  const io = initializeSocketIO(httpServer);

  const server = httpServer.listen(env.PORT, () => {
    logger.info(`🚀 WFA Backend API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`🏥 Health check available at: http://localhost:${env.PORT}/api/v1/health`);
    logger.info(`🔑 WebAuthn Relying Party: ${env.RP_NAME} (ID: ${env.RP_ID})`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    logger.info(`🛑 Received ${signal}. Initiating graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed.');
      io.close(async () => {
        logger.info('Socket.IO connections closed.');
        await disconnectDatabase();
        process.exit(0);
      });
    });

    // Force close after 10s if graceful shutdown hangs
    setTimeout(() => {
      logger.error('⚠️ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
