import * as redis from 'redis';
import { RedisClientType } from '@redis/client/dist/lib/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class RedisClient {
  public readonly client: RedisClientType;

  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this.client.connect();
  }
}
