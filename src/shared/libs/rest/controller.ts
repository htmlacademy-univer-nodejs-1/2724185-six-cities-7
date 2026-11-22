import {Router, type RequestHandler, type Response} from 'express';
import asyncHandler from 'express-async-handler';
import type {Middleware} from './middleware/middleware.interface.js';
import {StatusCodes} from 'http-status-codes';

export type HttpMethod = 'get' | 'post' | 'patch' | 'delete';
export interface Route {
  path: string;
  method: HttpMethod;
  handler: RequestHandler;
  middlewares?: Middleware[];
}
export interface ControllerInterface {
  readonly router: Router;
}

export abstract class Controller implements ControllerInterface {
  public readonly router = Router();

  protected addRoute({path, method, handler, middlewares = []}: Route): void {
    this.router[method](path, ...middlewares.map((middleware) => asyncHandler(middleware.execute.bind(middleware))), asyncHandler(handler.bind(this)));
  }

  protected ok(response: Response, data: unknown): void {
    response.status(StatusCodes.OK).json(data);
  }

  protected created(response: Response, data: unknown): void {
    response.status(StatusCodes.CREATED).json(data);
  }
}
