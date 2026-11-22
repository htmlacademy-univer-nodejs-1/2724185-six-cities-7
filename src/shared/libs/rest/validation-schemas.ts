import Joi from 'joi';

const location = Joi.object({latitude: Joi.number().required(), longitude: Joi.number().required()});
const cityName = Joi.string().valid('Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf');
const city = Joi.object({name: cityName.required(), location: location.required()});
const offerFields = {
  title: Joi.string().min(10).max(100),
  description: Joi.string().min(20).max(1024),
  city,
  previewImage: Joi.string().uri(),
  images: Joi.array().items(Joi.string().uri().required()).length(6),
  isPremium: Joi.boolean(),
  housingType: Joi.string().valid('apartment', 'house', 'room', 'hotel'),
  roomCount: Joi.number().integer().min(1).max(8),
  guestCount: Joi.number().integer().min(1).max(10),
  rentPrice: Joi.number().integer().min(100).max(100000),
  amenities: Joi.array().items(Joi.string().valid('Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge').required()),
  location,
};
export const createOfferSchema = Joi.object(offerFields).fork(Object.keys(offerFields), (schema) => schema.required()).required();
export const updateOfferSchema = Joi.object(offerFields).min(1).required();
export const createCommentSchema = Joi.object({text: Joi.string().min(5).max(1024).required(), rating: Joi.number().integer().min(1).max(5).required()}).required();
export const createUserSchema = Joi.object({name: Joi.string().min(1).max(15).required(), email: Joi.string().email().required(), password: Joi.string().min(6).max(12).required(), avatarPath: Joi.string().uri(), type: Joi.string().valid('regular', 'pro').required()}).required();
export const loginSchema = Joi.object({email: Joi.string().email().required(), password: Joi.string().required()}).required();
export const cityParamsSchema = Joi.object({cityName: cityName.required()}).required();
