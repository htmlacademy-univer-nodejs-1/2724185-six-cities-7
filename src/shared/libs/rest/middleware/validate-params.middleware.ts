import type {NextFunction, Request, Response} from 'express';
import type {ObjectSchema} from 'joi';
import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../exception-filter.js';
import type {Middleware} from './middleware.interface.js';

export class ValidateParamsMiddleware implements Middleware {
  constructor(private readonly schema: ObjectSchema) {}

  public execute(request: Request, _response: Response, next: NextFunction): void {
    const {error} = this.schema.validate(request.params, {convert: false});
    next(error ? new HttpError(StatusCodes.BAD_REQUEST, error.message) : undefined);
  }
}
