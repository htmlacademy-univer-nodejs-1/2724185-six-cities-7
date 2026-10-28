import {Container} from 'inversify';
import {Application} from './application/application.js';
import type {Config} from './shared/libs/config/config.interface.js';
import {RestConfig} from './shared/libs/config/rest.config.js';
import type {Logger} from './shared/libs/logger/logger.interface.js';
import {PinoLogger} from './shared/libs/logger/pino.logger.js';
import type {DatabaseClient} from './shared/libs/database-client/database-client.interface.js';
import {MongoDatabaseClient} from './shared/libs/database-client/mongo.database-client.js';
import {Component} from './shared/types/component.js';
import {OfferModel, type OfferModelType} from './modules/offer/offer.model.js';
import type {OfferService} from './modules/offer/offer-service.interface.js';
import {DefaultOfferService} from './modules/offer/default-offer.service.js';
import {UserModel, type UserModelType} from './modules/user/user.model.js';
import type {UserService} from './modules/user/user-service.interface.js';
import {DefaultUserService} from './modules/user/default-user.service.js';
import {ImportCommand} from './cli/import.command.js';
import {CommentModel, type CommentModelType} from './modules/comment/comment.model.js';
import type {CommentService} from './modules/comment/comment-service.interface.js';
import {DefaultCommentService} from './modules/comment/default-comment.service.js';

export function createContainer(): Container {
  const container = new Container();

  container.bind<Application>(Component.Application).to(Application).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<CommentModelType>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<OfferModelType>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<UserModelType>(Component.UserModel).toConstantValue(UserModel);
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand).inSingletonScope();

  return container;
}
