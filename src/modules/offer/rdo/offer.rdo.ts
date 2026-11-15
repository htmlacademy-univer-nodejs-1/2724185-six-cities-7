import {Expose, Type} from 'class-transformer';
import {UserRdo} from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose() public id!: string;
  @Expose() public title!: string;
  @Expose() public description!: string;
  @Expose() public publicationDate!: Date;
  @Expose() public city!: unknown;
  @Expose() public previewImage!: string;
  @Expose() public images!: string[];
  @Expose() public isPremium!: boolean;
  @Expose() public isFavorite!: boolean;
  @Expose() public rating!: number;
  @Expose() public housingType!: string;
  @Expose() public roomCount!: number;
  @Expose() public guestCount!: number;
  @Expose() public rentPrice!: number;
  @Expose() public amenities!: string[];
  @Expose() @Type(() => UserRdo) public author!: UserRdo;
  @Expose() public commentCount!: number;
  @Expose() public location!: unknown;
}
