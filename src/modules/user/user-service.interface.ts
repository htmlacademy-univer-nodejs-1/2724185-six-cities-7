import type {Types} from 'mongoose';
import type {CreateUserDto} from './dto/create-user.dto.js';
import type {UserDocument} from './user.model.js';

export interface UserService {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(data: CreateUserDto): Promise<UserDocument>;
  addFavoriteOffer(userId: string, offerId: Types.ObjectId): Promise<UserDocument | null>;
  removeFavoriteOffer(userId: string, offerId: Types.ObjectId): Promise<UserDocument | null>;
}
