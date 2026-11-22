import type {NextFunction, Request, Response} from 'express';
import type {ObjectSchema} from 'joi';
import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../exception-filter.js';
import type {Middleware} from './middleware.interface.js';

export class ValidateBodyMiddleware implements Middleware {
  constructor(private readonly schema: ObjectSchema) {}

  public execute(request: Request, _response: Response, next: NextFunction): void {
    const {error, value} = this.schema.validate(request.body, {abortEarly: false, convert: false});
    if (error) {
      next(new HttpError(StatusCodes.BAD_REQUEST, error.message));
      return;
    }
    request.body = value;
    next();
  }
}
