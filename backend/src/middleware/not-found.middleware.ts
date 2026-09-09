import { RequestHandler } from 'express';
import { sendError } from '../utils/api-response';

export const notFoundMiddleware: RequestHandler = (req, res) => {
  sendError(
    res,
    `Cannot find endpoint [${req.method}] ${req.originalUrl} on WFA API server`,
    404,
    'ROUTE_NOT_FOUND'
  );
};
