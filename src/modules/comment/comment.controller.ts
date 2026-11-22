import {inject, injectable} from 'inversify';
import type {Request, Response} from 'express';
import {plainToInstance} from 'class-transformer';
import {StatusCodes} from 'http-status-codes';
import {Component} from '../../shared/types/component.js';
import {Controller} from '../../shared/libs/rest/controller.js';
import {HttpError} from '../../shared/libs/rest/exception-filter.js';
import {ValidateObjectIdMiddleware} from '../../shared/libs/rest/middleware/validate-object-id.middleware.js';
import {ValidateBodyMiddleware} from '../../shared/libs/rest/middleware/validate-body.middleware.js';
import {createCommentSchema} from '../../shared/libs/rest/validation-schemas.js';
import type {AuthService} from '../../shared/libs/auth/auth.service.js';
import type {OfferService} from '../offer/offer-service.interface.js';
import type {UserService} from '../user/user-service.interface.js';
import {UserRdo} from '../user/rdo/user.rdo.js';
import type {CommentService} from './comment-service.interface.js';
import type {CommentDocument} from './comment.model.js';

@injectable()
export class CommentController extends Controller {
  constructor(
    @inject(Component.CommentService) private readonly comments: CommentService,
    @inject(Component.OfferService) private readonly offers: OfferService,
    @inject(Component.UserService) private readonly users: UserService,
    @inject(Component.AuthService) private readonly auth: AuthService,
  ) {
    super();
    this.addRoute({method: 'get', path: '/:offerId/comments', handler: this.index, middlewares: [new ValidateObjectIdMiddleware('offerId')]});
    this.addRoute({method: 'post', path: '/:offerId/comments', handler: this.create, middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateBodyMiddleware(createCommentSchema)]});
  }

  private async serialize(comment: CommentDocument): Promise<object> {
    const author = await this.users.findById(comment.author.toString());
    if (!author) {
      throw new Error(`Author not found for comment ${comment.id}`);
    }
    return {id: comment.id, text: comment.text, publicationDate: comment.publicationDate, rating: comment.rating,
      author: plainToInstance(UserRdo, {...author.toObject(), id: author.id}, {excludeExtraneousValues: true})};
  }

  private async index(request: Request, response: Response): Promise<void> {
    if (!await this.offers.findById(request.params.offerId)) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    this.ok(response, await Promise.all((await this.comments.findByOfferId(request.params.offerId)).map((comment) => this.serialize(comment))));
  }

  private async create(request: Request, response: Response): Promise<void> {
    const offer = await this.offers.findById(request.params.offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    const user = await this.auth.getCurrentOrAnonymous(request);
    const comment = await this.comments.create({text: request.body.text, rating: request.body.rating, author: user._id, offer: offer._id});
    this.created(response, await this.serialize(comment));
  }
}
