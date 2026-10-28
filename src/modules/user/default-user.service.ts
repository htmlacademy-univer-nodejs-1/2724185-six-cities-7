import {inject, injectable} from 'inversify';
import type {Types} from 'mongoose';
import {Component} from '../../shared/types/component.js';
import type {CreateUserDto} from './dto/create-user.dto.js';
import type {UserDocument, UserModelType} from './user.model.js';
import type {UserService} from './user-service.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.UserModel) private readonly userModel: UserModelType,
  ) {}

  public async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async create(data: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create({...data, favoriteOffers: []});
  }

  public async addFavoriteOffer(userId: string, offerId: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {$addToSet: {favoriteOffers: offerId}},
      {new: true},
    ).exec();
  }

  public async removeFavoriteOffer(userId: string, offerId: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {$pull: {favoriteOffers: offerId}},
      {new: true},
    ).exec();
  }
}
