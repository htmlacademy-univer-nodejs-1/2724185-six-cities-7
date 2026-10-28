import type {Types} from 'mongoose';

export interface CommentEntity {
  text: string;
  publicationDate: Date;
  rating: number;
  author: Types.ObjectId;
  offer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
