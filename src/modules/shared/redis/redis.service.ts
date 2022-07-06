import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  private isConnected = false;
  constructor(private readonly configService: ConfigService) {}

  async connect() {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
      password: this.configService.get('REDIS_PASSWORD'),
    });

    this.client.on('connect', () => console.log('Redis is connecting'));

    this.client.on('ready', () => {
      this.isConnected = true;
      console.log('Redis connected');
    });

    this.client.on('end', () => console.log('Redis disconnected'));

    this.client.on('error', (err) => console.error(err));

    this.client.on('reconnecting', () => console.log('Redis is reconnecting'));

    await this.client.connect();
  }

  private assertHasConnected() {
    if (!this.isConnected) {
      throw new InternalServerErrorException(
        'A connection to Redis has not been established',
      );
    }
  }

  async get(key: string) {
    this.assertHasConnected();

    return await this.client.get(key);
  }

  async set(key: string, value: string, ex?: number) {
    this.assertHasConnected();

    return ex
      ? await this.client.setEx(key, ex, value)
      : await this.client.set(key, value);
  }

  async del(key: string) {
    this.assertHasConnected();

    return await this.client.del(key);
  }
}
