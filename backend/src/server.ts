import http from 'http';
import { createApp } from './app';
import { env, validateExternalModuleConfig } from './config/env.config';
import { logger } from './config/logger';
import { initializeSocketIO } from './sockets/socket.server';

const startServer = (): void => {
  const app = createApp();
  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  const io = initializeSocketIO(httpServer);

  // Diagnostic checks for future modules
  validateExternalModuleConfig('mongodb');
  validateExternalModuleConfig('microsoft');

  const server = httpServer.listen(env.PORT, () => {
    logger.info(`🚀 WFA Backend API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`🏥 Health check available at: http://localhost:${env.PORT}/api/v1/health`);
  });

  // Graceful shutdown handling
  const shutdown = (signal: string) => {
    logger.info(`🛑 Received ${signal}. Initiating graceful shutdown...`);

    server.close(() => {
      logger.info('HTTP server closed.');
      io.close(() => {
        logger.info('Socket.IO connections closed.');
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
