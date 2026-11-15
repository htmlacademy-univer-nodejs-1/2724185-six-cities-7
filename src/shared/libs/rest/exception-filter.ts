import type {ErrorRequestHandler} from 'express';
import {StatusCodes} from 'http-status-codes';
import type {Logger} from '../logger/logger.interface.js';

export class HttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
  }
}

export function createExceptionFilter(logger: Logger): ErrorRequestHandler {
  return (error: unknown, _request, response, next) => {
    if (response.headersSent) {
      next(error);
      return;
    }
    const message = error instanceof Error ? error.message : String(error);
    logger.error(message);
    if (error instanceof HttpError) {
      response.status(error.statusCode).json({error: message});
      return;
    }
    if (error instanceof Error && 'status' in error && typeof error.status === 'number'
      && error.status >= 400 && error.status < 500) {
      response.status(error.status).json({error: error instanceof SyntaxError ? 'Invalid JSON' : message});
      return;
    }
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Internal Server Error'});
  };
}
