import type {CreateOfferDto} from './dto/create-offer.dto.js';

export interface OfferEntity extends CreateOfferDto {
  commentCount: number;
  isFavorite: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
