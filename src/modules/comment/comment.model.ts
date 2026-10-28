import {Schema, model, type HydratedDocument, type Model} from 'mongoose';
import type {CommentEntity} from './comment.entity.js';

const commentSchema = new Schema<CommentEntity>({
  text: {type: String, required: true},
  publicationDate: {type: Date, required: true, default: Date.now},
  rating: {type: Number, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  offer: {type: Schema.Types.ObjectId, ref: 'Offer', required: true},
}, {
  collection: 'comments',
  timestamps: true,
});

export type CommentDocument = HydratedDocument<CommentEntity>;
export type CommentModelType = Model<CommentEntity>;

export const CommentModel = model<CommentEntity>('Comment', commentSchema);
