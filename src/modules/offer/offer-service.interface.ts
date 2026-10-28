import type {Types} from 'mongoose';
import type {CityName} from '../../types/index.js';
import type {CreateOfferDto} from './dto/create-offer.dto.js';
import type {UpdateOfferDto} from './dto/update-offer.dto.js';
import type {OfferDocument} from './offer.model.js';

export interface OfferService {
  find(): Promise<OfferDocument[]>;
  findById(id: string): Promise<OfferDocument | null>;
  findPremiumByCity(city: CityName): Promise<OfferDocument[]>;
  findFavorites(userId: string): Promise<OfferDocument[]>;
  create(data: CreateOfferDto): Promise<OfferDocument>;
  updateById(id: string, data: UpdateOfferDto): Promise<OfferDocument | null>;
  deleteById(id: string): Promise<OfferDocument | null>;
  addToFavorites(userId: string, offerId: Types.ObjectId): Promise<OfferDocument | null>;
  removeFromFavorites(userId: string, offerId: Types.ObjectId): Promise<OfferDocument | null>;
  recalculateRatingAndCommentCount(offerId: string): Promise<void>;
}
