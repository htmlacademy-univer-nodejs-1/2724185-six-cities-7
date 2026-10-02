import type {Location} from './location.type.js';

export type CityName =
  | 'Paris'
  | 'Cologne'
  | 'Brussels'
  | 'Amsterdam'
  | 'Hamburg'
  | 'Dusseldorf';

export type City = {
  name: CityName;
  location: Location;
};
