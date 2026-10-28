import {inject, injectable} from 'inversify';
import {Component} from '../../shared/types/component.js';
import type {OfferService} from '../offer/offer-service.interface.js';
import type {CreateCommentDto} from './dto/create-comment.dto.js';
import type {CommentDocument, CommentModelType} from './comment.model.js';
import type {CommentService} from './comment-service.interface.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: CommentModelType,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async findByOfferId(offerId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({offer: offerId})
      .sort({publicationDate: -1})
      .limit(50)
      .exec();
  }

  public async create(data: CreateCommentDto): Promise<CommentDocument> {
    const comment = await this.commentModel.create(data);
    await this.offerService.recalculateRatingAndCommentCount(data.offer.toString());

    return comment;
  }
}
