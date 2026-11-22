import {inject, injectable} from 'inversify';
import type {Request, Response} from 'express';
import type {ParamsDictionary} from 'express-serve-static-core';
import {plainToInstance} from 'class-transformer';
import {StatusCodes} from 'http-status-codes';
import {ValidateBodyMiddleware} from '../../shared/libs/rest/middleware/validate-body.middleware.js';
import {createUserSchema, loginSchema} from '../../shared/libs/rest/validation-schemas.js';
import {Controller} from '../../shared/libs/rest/controller.js';
import {HttpError} from '../../shared/libs/rest/exception-filter.js';
import {verifyPassword} from '../../shared/libs/auth/password.js';
import type {AuthService} from '../../shared/libs/auth/auth.service.js';
import {Component} from '../../shared/types/component.js';
import type {CreateUserDto} from './dto/create-user.dto.js';
import type {LoginUserDto} from './dto/login-user.dto.js';
import type {UserService} from './user-service.interface.js';
import type {UserDocument} from './user.model.js';
import {UserRdo} from './rdo/user.rdo.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(Component.UserService) private readonly users: UserService,
    @inject(Component.AuthService) private readonly auth: AuthService,
  ) {
    super();
    this.addRoute({method: 'post', path: '/register', handler: this.create, middlewares: [new ValidateBodyMiddleware(createUserSchema)]});
    this.addRoute({method: 'get', path: '/login', handler: this.checkAuth});
    this.addRoute({method: 'post', path: '/login', handler: this.login, middlewares: [new ValidateBodyMiddleware(loginSchema)]});
  }

  private serialize(user: UserDocument): UserRdo {
    return plainToInstance(UserRdo, {...user.toObject(), id: user.id}, {excludeExtraneousValues: true});
  }

  private async create(request: Request<ParamsDictionary, unknown, CreateUserDto>, response: Response): Promise<void> {
    const {name, email, password, avatarPath, type} = request.body;
    if (await this.users.findByEmail(email)) {
      throw new HttpError(StatusCodes.CONFLICT, 'User already exists');
    }
    try {
      const user = await this.users.create({name, email, password, avatarPath, type});
      this.created(response, this.serialize(user));
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
        throw new HttpError(StatusCodes.CONFLICT, 'User already exists');
      }
      throw error;
    }
  }

  private async login(request: Request<ParamsDictionary, unknown, LoginUserDto>, response: Response): Promise<void> {
    const {email, password} = request.body;
    const user = await this.users.findByEmail(email);
    if (!user || !verifyPassword(password, user.password)) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }
    this.ok(response, {...this.serialize(user), token: this.auth.createToken(user.id)});
  }

  private async checkAuth(request: Request, response: Response): Promise<void> {
    this.ok(response, this.serialize(await this.auth.getCurrentOrAnonymous(request)));
  }
}
