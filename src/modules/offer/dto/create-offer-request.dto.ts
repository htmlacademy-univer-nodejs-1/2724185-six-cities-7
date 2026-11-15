import type {CreateOfferDto} from './create-offer.dto.js';

export type CreateOfferRequestDto = Omit<CreateOfferDto, 'author' | 'publicationDate'>;
