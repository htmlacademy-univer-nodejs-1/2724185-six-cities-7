import {inject, injectable} from 'inversify';
import type {Request, Response} from 'express';
import type {ParamsDictionary} from 'express-serve-static-core';
import {plainToInstance} from 'class-transformer';
import {StatusCodes} from 'http-status-codes';
import {Types} from 'mongoose';
import {Controller} from '../../shared/libs/rest/controller.js';
import {HttpError} from '../../shared/libs/rest/exception-filter.js';
import type {AuthService} from '../../shared/libs/auth/auth.service.js';
import {Component} from '../../shared/types/component.js';
import type {CityName} from '../../types/index.js';
import type {UserService} from '../user/user-service.interface.js';
import type {UserDocument} from '../user/user.model.js';
import type {CreateOfferRequestDto} from './dto/create-offer-request.dto.js';
import type {UpdateOfferDto} from './dto/update-offer.dto.js';
import type {OfferService} from './offer-service.interface.js';
import type {OfferDocument} from './offer.model.js';
import {OfferRdo} from './rdo/offer.rdo.js';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(Component.OfferService) private readonly offers: OfferService,
    @inject(Component.UserService) private readonly users: UserService,
    @inject(Component.AuthService) private readonly auth: AuthService,
  ) {
    super();
    this.addRoute({method: 'get', path: '/', handler: this.index});
    this.addRoute({method: 'post', path: '/', handler: this.create});
    this.addRoute({method: 'get', path: '/favorites', handler: this.favorites});
    this.addRoute({method: 'get', path: '/premium/:cityName', handler: this.premium});
    this.addRoute({method: 'get', path: '/:offerId', handler: this.show});
    this.addRoute({method: 'patch', path: '/:offerId', handler: this.update});
    this.addRoute({method: 'delete', path: '/:offerId', handler: this.delete});
    this.addRoute({method: 'post', path: '/:offerId/favorite', handler: this.addFavorite});
    this.addRoute({method: 'delete', path: '/:offerId/favorite', handler: this.removeFavorite});
  }

  private async serialize(offer: OfferDocument, user: UserDocument | null): Promise<OfferRdo> {
    const author = await this.users.findById(offer.author.toString());
    if (!author) {
      throw new Error(`Author not found for offer ${offer.id}`);
    }
    const isFavorite = user?.favoriteOffers.some((id) => id.toString() === offer.id) ?? false;
    return plainToInstance(OfferRdo, {...offer.toObject(), id: offer.id, isFavorite, author: {...author.toObject(), id: author.id}}, {excludeExtraneousValues: true});
  }

  private async getOffer(id: string): Promise<OfferDocument> {
    const offer = Types.ObjectId.isValid(id) && /^[a-f\d]{24}$/i.test(id) ? await this.offers.findById(id) : null;
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    return offer;
  }

  private assertOwner(offer: OfferDocument, user: UserDocument): void {
    if (offer.author.toString() !== user.id) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Only the author can modify this offer');
    }
  }

  private async index(request: Request, response: Response): Promise<void> {
    const user = await this.auth.getUser(request, false);
    this.ok(response, await Promise.all((await this.offers.find()).map((offer) => this.serialize(offer, user))));
  }

  private async premium(request: Request, response: Response): Promise<void> {
    const user = await this.auth.getUser(request, false);
    this.ok(response, await Promise.all((await this.offers.findPremiumByCity(request.params.cityName as CityName)).map((offer) => this.serialize(offer, user))));
  }

  private async show(request: Request, response: Response): Promise<void> {
    const user = await this.auth.getUser(request, false);
    this.ok(response, await this.serialize(await this.getOffer(request.params.offerId), user));
  }

  private async create(request: Request<ParamsDictionary, unknown, CreateOfferRequestDto>, response: Response): Promise<void> {
    const user = await this.auth.requireUser(request);
    const {title, description, city, previewImage, images, isPremium, housingType, roomCount, guestCount, rentPrice, amenities, location} = request.body;
    const offer = await this.offers.create({title, description, city, previewImage, images, isPremium, housingType, roomCount, guestCount, rentPrice, amenities, location, publicationDate: new Date(), author: user._id});
    this.created(response, await this.serialize(offer, user));
  }

  private async update(request: Request<ParamsDictionary, unknown, UpdateOfferDto>, response: Response): Promise<void> {
    const user = await this.auth.requireUser(request);
    const offer = await this.getOffer(request.params.offerId);
    this.assertOwner(offer, user);
    const {title, description, city, previewImage, images, isPremium, housingType, roomCount, guestCount, rentPrice, amenities, location} = request.body;
    const updates = Object.fromEntries(Object.entries({title, description, city, previewImage, images, isPremium, housingType, roomCount, guestCount, rentPrice, amenities, location}).filter(([, value]) => value !== undefined));
    const updated = await this.offers.updateById(offer.id, updates);
    if (!updated) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    this.ok(response, await this.serialize(updated, user));
  }

  private async delete(request: Request, response: Response): Promise<void> {
    const user = await this.auth.requireUser(request);
    const offer = await this.getOffer(request.params.offerId);
    this.assertOwner(offer, user);
    if (!await this.offers.deleteById(offer.id)) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    response.status(StatusCodes.NO_CONTENT).send();
  }

  private async favorites(request: Request, response: Response): Promise<void> {
    const user = await this.auth.requireUser(request);
    this.ok(response, await Promise.all((await this.offers.findFavorites(user.id)).map((offer) => this.serialize(offer, user))));
  }

  private async addFavorite(request: Request, response: Response): Promise<void> {
    const user = await this.auth.requireUser(request);
    const offer = await this.getOffer(request.params.offerId);
    await this.offers.addToFavorites(user.id, offer._id);
    const updatedUser = await this.auth.requireUser(request);
    this.ok(response, await this.serialize(offer, updatedUser));
  }

  private async removeFavorite(request: Request, response: Response): Promise<void> {
    const user = await this.auth.requireUser(request);
    const offer = await this.getOffer(request.params.offerId);
    await this.offers.removeFromFavorites(user.id, offer._id);
    const updatedUser = await this.auth.requireUser(request);
    this.ok(response, await this.serialize(offer, updatedUser));
  }
}
