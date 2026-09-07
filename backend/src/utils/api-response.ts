import { Response } from 'express';
import { ApiErrorResponse, ApiSuccessResponse } from '../types/common.types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  messageOrStatus: string | number = 200,
  statusCode = 200
): Response => {
  const finalStatus = typeof messageOrStatus === 'number' ? messageOrStatus : statusCode;
  const message = typeof messageOrStatus === 'string' ? messageOrStatus : undefined;

  const responsePayload: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: message ? { message } : undefined,
    timestamp: new Date().toISOString(),
  };
  return res.status(finalStatus).json(responsePayload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  code = 'BAD_REQUEST',
  details?: unknown
): Response => {
  const errorPayload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(errorPayload);
};
