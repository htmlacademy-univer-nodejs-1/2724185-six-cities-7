import convict, {type Config as ConvictConfig, type Schema} from 'convict';
import formats from 'convict-format-with-validator';
import dotenv from 'dotenv';
import {injectable} from 'inversify';
import type {Config} from './config.interface.js';

export type RestConfigSchema = {
  port: number;
  dbHost: string;
  dbUri: string;
  salt: string;
  jwtSecret: string;
};

const schema: Schema<RestConfigSchema> = {
  port: {
    doc: 'Порт REST API сервера',
    format: 'port',
    env: 'PORT',
    default: null,
  },
  dbHost: {
    doc: 'IP-адрес сервера базы данных',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null,
  },
  dbUri: {
    doc: 'URI подключения к MongoDB',
    format: String,
    env: 'DB_URI',
    default: 'mongodb://admin:test@127.0.0.1:27017/six-cities?authSource=admin',
    sensitive: true,
  },
  jwtSecret: {
    doc: 'Секрет подписи JWT',
    format: (value: string): void => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error('JWT_SECRET не должен быть пустым.');
      }
    },
    env: 'JWT_SECRET',
    default: null,
    sensitive: true,
  },
  salt: {
    doc: 'Соль для хеширования паролей',
    format: (value: string): void => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error('Соль не должна быть пустой.');
      }
    },
    env: 'SALT',
    default: null,
    sensitive: true,
  },
};

convict.addFormats(formats);

@injectable()
export class RestConfig implements Config {
  private readonly config: ConvictConfig<RestConfigSchema>;

  constructor() {
    dotenv.config();
    this.config = convict<RestConfigSchema>(schema);
    this.config.validate({allowed: 'strict'});
  }

  public get<Key extends keyof RestConfigSchema>(key: Key): RestConfigSchema[Key] {
    return this.config.get(key) as RestConfigSchema[Key];
  }
}
