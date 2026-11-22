import express, {type Express} from 'express';
import {inject, injectable} from 'inversify';
import type {Config} from '../shared/libs/config/config.interface.js';
import type {Logger} from '../shared/libs/logger/logger.interface.js';
import type {DatabaseClient} from '../shared/libs/database-client/database-client.interface.js';
import {createExceptionFilter} from '../shared/libs/rest/exception-filter.js';
import {Component} from '../shared/types/component.js';
import type {CommentController} from '../modules/comment/comment.controller.js';
import type {OfferController} from '../modules/offer/offer.controller.js';
import type {UserController} from '../modules/user/user.controller.js';

@injectable()
export class Application {
  private readonly app: Express = express();

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config,
    @inject(Component.DatabaseClient) private readonly database: DatabaseClient,
    @inject(Component.CommentController) private readonly commentController: CommentController,
    @inject(Component.OfferController) private readonly offerController: OfferController,
    @inject(Component.UserController) private readonly userController: UserController,
  ) {}

  private registerMiddleware(): void {
    this.app.use(express.json());
  }

  public async init(): Promise<void> {
    this.registerMiddleware();
    this.app.use('/api/offers', this.commentController.router);
    this.app.use('/api/offers', this.offerController.router);
    this.app.use('/api/users', this.userController.router);
    this.app.use(createExceptionFilter(this.logger));
    await this.database.connect(this.config.get('dbUri'));
    const port = this.config.get('port');
    this.app.listen(port, () => this.logger.info(`Сервер запущен на порту ${port}.`));
  }
}
