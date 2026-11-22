import type {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../exception-filter.js';
import type {Middleware} from './middleware.interface.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private readonly parameter: string) {}

  public execute(request: Request, _response: Response, next: NextFunction): void {
    if (!/^[a-f\d]{24}$/i.test(request.params[this.parameter] ?? '')) {
      next(new HttpError(StatusCodes.BAD_REQUEST, `Invalid ${this.parameter}`));
      return;
    }
    next();
  }
}
