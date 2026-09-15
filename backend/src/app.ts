import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import session from 'express-session';
import { env } from './config/env.config';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { requestLogger } from './middleware/request-logger.middleware';
import { apiRateLimiter, corsMiddleware, helmetMiddleware } from './middleware/security.middleware';
import { apiRouter } from './routes/api.router';

export const createApp = (): Application => {
  const app: Application = express();

  // Security and Request Handling Middlewares
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  app.use(requestLogger);

  // Session Management with MongoDB Store
  app.use(
    session({
      name: 'wfa_session',
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: env.MONGODB_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60, // 24 hours
        autoRemove: 'native',
      }),
      cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  // Apply rate limiter to /api routes
  app.use('/api', apiRateLimiter);

  // Mount API v1 router
  app.use('/api/v1', apiRouter);

  // 404 Route Handler
  app.use(notFoundMiddleware);

  // Centralized Error Handling
  app.use(errorMiddleware);

  return app;
};
