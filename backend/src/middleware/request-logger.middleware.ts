import { RequestHandler } from 'express';
import morgan from 'morgan';
import { env } from '../config/env.config';

// Morgan request logger configured for enterprise observability
export const requestLogger: RequestHandler = morgan(
  env.NODE_ENV === 'production'
    ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
    : ':method :url :status :res[content-length] - :response-time ms'
);
