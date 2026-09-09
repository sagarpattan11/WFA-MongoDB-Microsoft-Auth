import { Request, Response } from 'express';
import { sendError } from '../utils/api-response';

export const notFoundMiddleware = (req: Request, res: Response): void => {
  sendError(
    res,
    'ROUTE_NOT_FOUND',
    `Endpoint [${req.method}] ${req.originalUrl} does not exist on this server.`,
    404
  );
};
