import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.config';
import { logger } from '../config/logger';
import { sendError } from '../utils/api-response';

export const errorMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error(`Unhandled Exception at [${req.method}] ${req.originalUrl}:`, err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    sendError(
      res,
      'Input validation failed',
      422,
      'VALIDATION_ERROR',
      err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }))
    );
    return;
  }

  // Handle CORS errors
  if (err.message && err.message.includes('CORS policy')) {
    sendError(res, err.message, 403, 'CORS_ERROR');
    return;
  }

  // Handle standard HTTP errors or generic errors
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message =
    env.NODE_ENV === 'production' && statusCode === 500
      ? 'An internal server error occurred.'
      : err.message || 'Internal server error';

  sendError(
    res,
    message,
    statusCode,
    err.code || 'INTERNAL_SERVER_ERROR',
    env.NODE_ENV === 'development' ? err.stack : undefined
  );
};
