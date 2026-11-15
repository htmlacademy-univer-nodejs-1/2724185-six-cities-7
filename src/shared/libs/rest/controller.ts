import {Router, type RequestHandler, type Response} from 'express';
import asyncHandler from 'express-async-handler';
import {StatusCodes} from 'http-status-codes';

export type HttpMethod = 'get' | 'post' | 'patch' | 'delete';
export interface Route {
  path: string;
  method: HttpMethod;
  handler: RequestHandler;
}
export interface ControllerInterface {
  readonly router: Router;
}

export abstract class Controller implements ControllerInterface {
  public readonly router = Router();

  protected addRoute({path, method, handler}: Route): void {
    this.router[method](path, asyncHandler(handler.bind(this)));
  }

  protected ok(response: Response, data: unknown): void {
    response.status(StatusCodes.OK).json(data);
  }

  protected created(response: Response, data: unknown): void {
    response.status(StatusCodes.CREATED).json(data);
  }
}
