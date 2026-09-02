import { Request, Response } from 'express';
import { env } from '../config/env.config';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'WFA API',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
