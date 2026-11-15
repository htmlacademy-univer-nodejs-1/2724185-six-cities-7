import {inject, injectable} from 'inversify';
import type {Request} from 'express';
import jwt from 'jsonwebtoken';
import {StatusCodes} from 'http-status-codes';
import type {Config} from '../config/config.interface.js';
import {HttpError} from '../rest/exception-filter.js';
import {Component} from '../../types/component.js';
import type {UserService} from '../../../modules/user/user-service.interface.js';
import type {UserDocument} from '../../../modules/user/user.model.js';

@injectable()
export class AuthService {
  constructor(
    @inject(Component.Config) private readonly config: Config,
    @inject(Component.UserService) private readonly users: UserService,
  ) {}

  public createToken(userId: string): string {
    return jwt.sign({}, this.config.get('jwtSecret'), {subject: userId, expiresIn: '1d', algorithm: 'HS256'});
  }

  public async getUser(request: Request, required = true): Promise<UserDocument | null> {
    const header = request.get('Authorization');
    if (!header && !required) {
      return null;
    }
    const match = header?.match(/^Bearer\s+(\S+)$/i);
    if (!match) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }
    let userId: string;
    try {
      const payload = jwt.verify(match[1], this.config.get('jwtSecret'), {algorithms: ['HS256']});
      if (typeof payload === 'string' || !payload.sub || !/^[a-f\d]{24}$/i.test(payload.sub)) {
        throw new Error('Invalid token');
      }
      userId = payload.sub;
    } catch {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token');
    }
    const user = await this.users.findById(userId);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token');
    }
    return user;
  }

  public async requireUser(request: Request): Promise<UserDocument> {
    const user = await this.getUser(request);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }
    return user;
  }
}
