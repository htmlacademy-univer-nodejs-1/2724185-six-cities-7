import type {Types} from 'mongoose';
import type {Offer} from '../../../types/index.js';

export type CreateOfferDto = Omit<Offer, 'author' | 'commentCount' | 'isFavorite' | 'rating'> & {
  author: Types.ObjectId;
};
