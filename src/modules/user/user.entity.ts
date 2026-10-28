import type {Types} from 'mongoose';
import type {User} from '../../types/index.js';

export interface UserEntity extends User {
  favoriteOffers: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
