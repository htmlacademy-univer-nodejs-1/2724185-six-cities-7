import type {Types} from 'mongoose';
import type {Comment} from '../../../types/index.js';

export type CreateCommentDto = Omit<Comment, 'author' | 'publicationDate'> & {
  author: Types.ObjectId;
  offer: Types.ObjectId;
};
