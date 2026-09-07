import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/api-response';

export interface AuthenticatedSession {
  userId?: string;
  username?: string;
  email?: string;
  displayName?: string;
  roles?: string[];
  challenge?: string;
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
    email?: string;
    displayName?: string;
    roles?: string[];
    currentChallenge?: string;
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session || !req.session.userId) {
    sendError(res, 'Authentication required. Please sign in with your passkey.', 401);
    return;
  }
  next();
};
