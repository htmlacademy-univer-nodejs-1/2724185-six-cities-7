import {inject, injectable} from 'inversify';
import {Types} from 'mongoose';
import type {CityName} from '../../types/index.js';
import {Component} from '../../shared/types/component.js';
import type {CommentModelType} from '../comment/comment.model.js';
import type {UserService} from '../user/user-service.interface.js';
import type {CreateOfferDto} from './dto/create-offer.dto.js';
import type {UpdateOfferDto} from './dto/update-offer.dto.js';
import type {OfferDocument, OfferModelType} from './offer.model.js';
import type {OfferService} from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: OfferModelType,
    @inject(Component.CommentModel) private readonly commentModel: CommentModelType,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {}

  public async find(): Promise<OfferDocument[]> {
    return this.offerModel.find().sort({publicationDate: -1}).limit(60).exec();
  }

  public async findById(id: string): Promise<OfferDocument | null> {
    return this.offerModel.findById(id).exec();
  }

  public async findPremiumByCity(city: CityName): Promise<OfferDocument[]> {
    return this.offerModel.find({'city.name': city, isPremium: true}).limit(3).exec();
  }

  public async findFavorites(userId: string): Promise<OfferDocument[]> {
    const user = await this.userService.findById(userId);

    if (!user) {
      return [];
    }

    return this.offerModel.find({_id: {$in: user.favoriteOffers}}).exec();
  }

  public async create(data: CreateOfferDto): Promise<OfferDocument> {
    return this.offerModel.create({...data, commentCount: 0, isFavorite: false, rating: 0});
  }

  public async updateById(id: string, data: UpdateOfferDto): Promise<OfferDocument | null> {
    return this.offerModel.findByIdAndUpdate(id, data, {new: true}).exec();
  }

  public async deleteById(id: string): Promise<OfferDocument | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }

  public async addToFavorites(userId: string, offerId: Types.ObjectId): Promise<OfferDocument | null> {
    await this.userService.addFavoriteOffer(userId, offerId);
    return this.findById(offerId.toString());
  }

  public async removeFromFavorites(userId: string, offerId: Types.ObjectId): Promise<OfferDocument | null> {
    await this.userService.removeFavoriteOffer(userId, offerId);
    return this.findById(offerId.toString());
  }

  public async recalculateRatingAndCommentCount(offerId: string): Promise<void> {
    const [statistics] = await this.commentModel.aggregate<{
      averageRating: number;
      commentCount: number;
    }>([
      {$match: {offer: new Types.ObjectId(offerId)}},
      {$group: {_id: '$offer', averageRating: {$avg: '$rating'}, commentCount: {$sum: 1}}},
    ]).exec();

    await this.offerModel.findByIdAndUpdate(offerId, {
      commentCount: statistics?.commentCount ?? 0,
      rating: statistics?.averageRating ?? 0,
    }).exec();
  }
}
