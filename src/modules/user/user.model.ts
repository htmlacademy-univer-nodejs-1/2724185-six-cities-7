import {Schema, model, type HydratedDocument, type Model} from 'mongoose';
import type {UserEntity} from './user.entity.js';

const userSchema = new Schema<UserEntity>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  avatarPath: {type: String},
  password: {type: String, required: true},
  type: {type: String, enum: ['regular', 'pro'], required: true},
  favoriteOffers: [{type: Schema.Types.ObjectId, ref: 'Offer'}],
}, {
  collection: 'users',
  timestamps: true,
});

export type UserDocument = HydratedDocument<UserEntity>;
export type UserModelType = Model<UserEntity>;

export const UserModel = model<UserEntity>('User', userSchema);
